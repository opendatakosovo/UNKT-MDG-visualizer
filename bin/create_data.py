#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
from mosaicData import MosaicData
import json

s_filepath = "../data/raw_data/satisfied.csv"
d_filepath = "../data/raw_data/dissatisfied.csv"
p_filepath = "../data/raw_data/problems.csv"
w_filepath = "../data/standard_lists/whitelist.xlsx"
output_filepath = "../data/clean_data/"

# Create Mosaic object
mosaicS = MosaicData(data_filepath = s_filepath, data_type = 'consolidated', sat_or_dis = 's')
mosaicD = MosaicData(data_filepath = d_filepath, data_type = 'consolidated', sat_or_dis = 'd')
mosaicP = MosaicData(data_filepath = p_filepath, data_type = 'problems')
mosaicW = MosaicData(data_filepath = w_filepath, data_type = 'whitelist')

# Import the data
mosaicS.import_consolidated_data()
mosaicD.import_consolidated_data()
mosaicP.import_problems_data()

# Create years list
mosaicS.regenerate_years_list()

# Transform the data
mosaicS.transform_consolidated_data(scalar = 100)
mosaicD.transform_consolidated_data(scalar = 100)
mosaicP.transform_problems_data(scalar = 100)

# Delete previous (indicator) files
mosaicS.delete_old_files(output_filepath)

# Write new files
#output_type = "csv"
output_type = "json"
mosaicS.output_data(output_filepath, output_type)
mosaicD.output_data(output_filepath, output_type)
mosaicP.output_data(output_filepath, output_type)

# Regenerate Whitelists
mosaicW.regenerate_whitelists()

