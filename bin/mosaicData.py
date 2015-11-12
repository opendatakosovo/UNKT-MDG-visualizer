#!/usr/local/bin/python3.1
import pandas as pd

class MosaicData:
    
    def __init__(self, data_filepath, mapping_filepath, values_filepath):
            self.data = data_filepath
            self.mapping = mapping_filepath
            self.values = values_filepath

    def import_data(self):
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

    def convert_to_values(self, data, value_method):
        # import value mapping
        value_map = pd.read_csv(self.values, header=0, delimiter=",", quoting=1, index_col=0)
        text_values = list(value_map.index)
        
        # Get columns to be mapped
        mapping = pd.read_csv(self.mapping, header=0, delimiter=",", quoting=1, index_col=0)
        cols_w_text = list(mapping.loc[mapping.conversion_needed == 1,'refined_name'])
        
        # Get remaining columns
        all_cols = list(data.columns)
        all_cols.remove('Municipality')
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
        results = data.groupby(aggregate_by).mean()
        return results