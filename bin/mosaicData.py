#!/usr/local/bin/python3.1
import pandas as pd

class MosaicData:
    
    def __init__(self, data_filepath, lookup_filepath, mapping_filepath, cols_with_text):
            self.data = data_filepath
            self.lookup = lookup_filepath
            self.mapping = mapping_filepath
            self.cols_w_text = cols_with_text

    def import_data(self):
        # Import raw data
        data = pd.read_csv(self.data, header=0, delimiter=",", quoting=1, index_col=0, dtype=str)

        # Import lookup
        lookup = pd.read_csv(self.lookup, header=0, delimiter=",", quoting=1, index_col=0)

        # Extract appropriate columns
        questions = list(lookup["question"])
        data = data[questions]

        # Update Column Names
        column_names = list(lookup["refined_name"])
        data.columns = column_names

        return data

    def convert_to_values(self, data):
        # import mapping
        mapping = pd.read_csv(self.mapping, header=0, delimiter=",", quoting=1, index_col=0)
        text_values = list(mapping.index)
    
        # Get remaining columns
        all_cols = list(data.columns)
        all_cols.remove('Municipality')
        other_cols = list(set(all_cols) - set(self.cols_w_text))
    
        # Replace text fields 
        for col in self.cols_w_text:
            for text in text_values:
                data.loc[data[col] == text, col] = mapping.at[text, "value"]
    
        # Replace whitespace fields with 0
        for col in other_cols:
            data.loc[data[col].str.strip() == "", col] = 0
        
        # Convert all fields to numeric datatype
        for col in all_cols:
            data[col] = data[col].astype(float)
    
        return data

    def aggregate_scores(self, data, aggregate_by):    
        return data.groupby(aggregate_by).mean()











