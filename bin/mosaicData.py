#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
import pandas as pd
import os, shutil
import json

class MosaicData:
    
    def __init__(self, data_filepath, data_type, sat_or_dis = None, mapping_filepath = None, values_filepath = None):
            # data_type can be 'raw', 'consolidated' or 'problems' 
            # sat_or_dis can be 's' or 'd'

            self.data_path = data_filepath
            self.data_type = data_type
            
            # Check sat_or_dis is 'd' or 's'
            if data_type == 'consolidated':
                if sat_or_dis.lower() != 'd' and sat_or_dis.lower() != 's':
                    raise TypeError("When importing consolidated data, the 'sat_or_dis' parameter must be set to 's' (satisfied %) or 'd' (dissatisfied %).")
                else:
                    self.sat_or_dis = sat_or_dis.lower()
            
            # Handle additional parameters if data type = 'raw'
            if data_type == 'raw': 
                if mapping_filepath != None:
                    raise TypeError("When data_type set to 'raw', a path for a mapping must be passed.")
                elif values_filepath != None:
                    raise TypeError("When data_type set to 'raw', a path for a value mapping must be passed.")
                else:
                    self.mapping = mapping_filepath
                    self.values = values_filepath

    def import_raw_data(self):
        if self.data_type == 'raw':
            # Import raw data
            self.data = pd.read_csv(self.data_path, header=0, delimiter=",", quoting=1, index_col=0, dtype=str)

            # Import lookup
            mapping = pd.read_csv(self.mapping, header=0, delimiter=",", quoting=1, index_col=0)

            # Extract appropriate columns
            questions = list(mapping["question"])
            data = data[questions]

            # Update Column Names
            column_names = list(mapping["refined_name"])
            data.columns = column_names
            self.data = data
        else:
            print("MosaicData object has wrong datatype for this method.")
    
    def import_consolidated_data(self):
        if self.data_type == 'consolidated':
            # Import consolidated data
            data = pd.read_csv(self.data_path, header=0, delimiter=",", quoting=1, index_col=None)
            
            self.data = data
        else: 
            print("MosaicData object has wrong datatype for this method.")

    def import_problems_data(self):
        if self.data_type == 'problems':
            # Import consolidated data
            data = pd.read_csv(self.data_path, header=0, delimiter=",", quoting=1, index_col=None)
            self.data = data
        else: 
            print("MosaicData object has wrong datatype for this method.")

    def convert_to_values(self, value_method):
        data = self.data
        # import value mapping
        value_map = pd.read_csv(self.values, header=0, delimiter=",", quoting=1, index_col=0)
        text_values = list(value_map.index)
        
        # Get columns to be mapped
        mapping = pd.read_csv(self.mapping, header=0, delimiter=",", quoting=1, index_col=0)
        cols_w_text = list(mapping.loc[mapping.conversion_needed == 1,"refined_name"])
        
        # Get remaining columns
        all_cols = list(data.columns)
        all_cols.remove("Municipality")
        other_cols = list(set(all_cols) - set(cols_w_text))
        
        # Replace text fields 
        for col in cols_w_text:
            matches = pd.Series(data[col]).isin(text_values)
            unmapped = len(matches) - matches.sum()
            
            # Print warning if unmapped values found
            if unmapped > 0:
                print("Warning: " + str(unmapped) + " record(s) in the column '" + col + "' did not match a value in the value mapping.")

            for text in text_values:
                    data.loc[data[col] == text, col] = value_map.at[text, value_method]
                
        # Replace whitespace fields with 0
        for col in other_cols:
            data.loc[data[col].str.strip() == "", col] = 0
        
        # Convert all fields to numeric datatype
        for col in all_cols:
            try:
                data[col] = data[col].astype(float)
            except:
                print("Warning: At least 1 value in column '" + col + "' could not be converted to a numeric datatype.")
        self.data = data

    def aggregate_scores(self, aggregate_by):
        return self.data.groupby(aggregate_by).mean()
        
    def transform_consolidated_data(self, year_col = 'year', indicator_col = "indicator", scalar = 1):
        if self.data_type == 'consolidated':
            data = self.data
        
            # Get unique year values
            years = data[year_col].drop_duplicates().values.tolist()
            years = sorted(years)
            final_data = []
        
            # Get Column List
            all_cols = list(data.columns)
            all_cols.remove(year_col)
            all_cols.remove(indicator_col)
        
            # Loop through years, pull out data, transpose and store in list
            for year in years:
                year_data = data.loc[data[year_col] == year, ]
                reindexed_data = year_data.set_index(keys = indicator_col, drop=True)[all_cols]
            
                # Transpose the data and multiply by optional scalar
                transposed_data = reindexed_data.transpose() * scalar
                result_set = {'year' : year,
                'data' : transposed_data}
                final_data.append(result_set)
            
            self.data = final_data
        else: 
            print("MosaicData object requires data_type = 'consolidated' to use this method.")
    
    def transform_problems_data(self, year_col = 'year', problem_col = "problem", scalar = 1):
        if self.data_type == 'problems':
            data = self.data
            
            # Get unique year values
            years = data[year_col].drop_duplicates().values.tolist()
            years = sorted(years)
            final_data = []
        
            # Get muncipalities List
            municipalities = list(data.columns)
            municipalities.remove(year_col)
            municipalities.remove(problem_col)
            
            
            # Scale Data
            data[municipalities] = data[municipalities]*scalar
            
            # Loop through municipalities 
            for muni in municipalities:
                muni_data = data.loc[ : , [year_col, problem_col, muni]]
                muni_data = muni_data.loc[muni_data[muni].notnull(),]
                
                
                # Loop through years
                for year in years:
                    year_data = muni_data.loc[data[year_col] == year, [problem_col, muni]]
                    year_data.columns = ['label', 'value']
                    year_data = year_data.to_dict(orient = 'records')
                    
                    # Create dictionary with values
                    result_set = {'year' : year, 
                    'municipality' : muni,
                    'values' : year_data
                    }
                final_data.append(result_set)
            
            self.data = final_data
        else: 
            print("MosaicData object requires data_type = 'consolidated' to use this method.")
    
    def output_data(self, output_file, output_type = 'json'):
        data = self.data
        
        # Consolidated data type
        if self.data_type == 'consolidated':
            for entries in data:
                year = entries["year"]
                
                # Is the data satisfied or dissatisfied percentage?
                if self.sat_or_dis == 's':
                    file_path = output_file + str(year) + "S"
                elif self.sat_or_dis == 'd':
                    file_path = output_file + str(year) + "D"
                    
                # CSV or JSON file type?
                if output_type == "csv":
                    file_path = file_path + ".csv"
                    entries["data"].to_csv(path_or_buf = file_path, force_ascii = False)  
                else: 
                    file_path = file_path + ".json"
                    entries["data"].to_json(orient = "index", path_or_buf = file_path, force_ascii = False)  
        
        # Problem data type
        if self.data_type == 'problems': 
            file_path = output_file + "problems.json"
            with open(file_path, 'w') as data_file:
                json.dump(obj = data, fp = data_file, indent = 4, sort_keys = True)
        
        # Raw Datatype
        elif self.data_type == 'raw':
            if output_type == "csv":
                data.to_csv(path_or_buf = output_file, force_ascii = False)
            else:
                data.to_json(orient = "index", path_or_buf = output_file, force_ascii = False)
    
    def delete_old_files(self, folder = "../data/clean_data/"):
        for the_file in os.listdir(folder):
            file_path = os.path.join(folder, the_file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception, e:
                print e
    
    def regenerate_years_list(self, year_col = 'year'):
        try:
            years = self.data[year_col].drop_duplicates().values.tolist()
            years = sorted(years)
            file_path = "../data/mapping/years.json"
            with open(file_path, 'w') as data_file:
                json.dump(years, data_file)
        except Exception, e:
            print e
            print "Years must be generated before the transform step."
    
    def regenerate_whitelists(self):
        if self.data_type == 'whitelist':
            keys = ['municipalities', 'indicators', 'problems']
            for key in keys:
                sheet = pd.read_excel(self.data_path, key, index_col = 0)
                output_file = "../data/standard_lists/" + key + ".json"
                sheet.to_json(orient = "index", path_or_buf = output_file, force_ascii = False)
                
        else: 
            print("MosaicData object requires data_type = 'whitelist' to use this method.")