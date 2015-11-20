#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
from mosaicData import MosaicData
import json

s_filepath = "../data/raw_data/satisfied.csv"
d_filepath = "../data/raw_data/dissatisfied.csv"
output_filepath = "../data/clean_data/"

# Create Mosaic object
mosaicS = MosaicData(data_filepath = s_filepath, sat_or_dis = 's')
mosaicD = MosaicData(data_filepath = d_filepath, sat_or_dis = 'd')

# Import the data
mosaicS.import_consolidated_data()
mosaicD.import_consolidated_data()
mosaicS.regenerate_years_list()

# Transform the data
mosaicS.transform_consolidated_data(scalar = 100)
mosaicD.transform_consolidated_data(scalar = 100)

# Delete previous files
mosaicS.delete_old_files(output_filepath)

# Write new files
#output_type = "csv"
output_type = "json"
mosaicS.output_data(output_filepath, output_type)
mosaicD.output_data(output_filepath, output_type)