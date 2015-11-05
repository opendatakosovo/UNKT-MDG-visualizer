#!/usr/local/bin/python3.1
import pandas as pd


def importData(data, lookup):
    # Import raw data
    data = pd.read_csv(data_filepath, header=0, delimiter=",", quoting=1, index_col=0)

    # Import lookup
    lookup = pd.read_csv(lookup_filepath, header=0, delimiter=",", quoting=1, index_col=0)

    # Extract appropriate columns
    questions = list(lookup["question"])
    data = data[questions]

    # Update Column Names
    column_names = list(lookup["refined_name"])
    data.columns = column_names

    return data


############################################
# Test method 
############################################
data_filepath = "data/raw_data/Mosaic 2012.csv"
lookup_filepath = "data/2012_field_lookup_alt.csv"
data = importData(data_filepath, lookup_filepath)

print(data.columns)