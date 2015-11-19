#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
from mosaicData import MosaicData
import json

data_filepath = "../data/raw_data/consolidated_indicators_mod.csv"
output_filepath = "../data/clean_data/"
data_type = 'consolidated'

# Create Mosaic object
mosaic2012 = MosaicData(data_filepath, data_type)

# Import the data
mosaic2012.import_consolidated_data()
mosaic2012.regenerate_years_list()

# Transform the data
mosaic2012.transform_consolidated_data(scalar = 100)

# Delete previous files
mosaic2012.delete_old_files(output_filepath)

# Write new files
#output_type = "csv"
output_type = "json"
mosaic2012.output_data(output_filepath, output_type)  