#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
import pandas as pd

class MosaicData:
    
    def __init__(self, data_filepath, data_type, mapping_filepath = None, values_filepath = None):
            self.data = data_filepath
            self.data_type = data_type
            if mapping_filepath != None: 
                self.mapping = mapping_filepath
            if values_filepath != None:
                self.values = values_filepath

    def import_raw_data(self):
        if self.data_type == 'raw':
            # Import raw data
            data = pd.read_csv(self.data, header=0, delimiter=",", quoting=1, index_col=0, dtype=str)

            # Import lookup
            mapping = pd.read_csv(self.mapping, header=0, delimiter=",", quoting=1, index_col=0)

            # Extract appropriate columns
            questions = list(mapping["question"])
            data = data[questions]

            # Update Column Names
            column_names = list(mapping["refined_name"])
            data.columns = column_names
            return data
        else:
            print("MosaicData object has wrong datatype for this method.")

    def convert_to_values(self, data, value_method):
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
        return data

    def aggregate_scores(self, data, aggregate_by):
        return data.groupby(aggregate_by).mean()
        
    def import_consolidated_data(self):
        if self.data_type == 'consolidated':
            # Import consolidated data
            data = pd.read_csv(self.data, header=0, delimiter=",", quoting=1, index_col=None)
            
            return data
        else: 
            print("MosaicData object has wrong datatype for this method.")
    
    def transform_consolidated_data(self, data, year_col = 'Year', indicator_col = "indicator"):
        
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
            transposed_data = reindexed_data.transpose()
            result_set = {'year' : year,
                          'data' : transposed_data}
            final_data.append(result_set)
            
        return final_data
    
    def return_json(self, data, output_file):
        if isinstance(data, list):
            for entries in data:
                year = entries["year"]
                file_path = output_file + str(year) + ".json"
                entries["data"].to_json(orient = "index", path_or_buf = file_path, force_ascii = False)         
        elif isinstance(data, pd.DataFrame):
            data.to_json(orient = "index", path_or_buf = output_file, force_ascii = False)
        return "Success"
    