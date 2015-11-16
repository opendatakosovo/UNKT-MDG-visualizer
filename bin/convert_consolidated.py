#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
from mosaicData import MosaicData
import json

data_filepath = "../data/consolidated_indicators_mod.csv"
output_filepath = "../data/output"
data_type = 'consolidated'
output_type = "csv"
#output_type = "json"

mosaic2012 = MosaicData(data_filepath, data_type)
results1 = mosaic2012.import_consolidated_data()
results2 = mosaic2012.transform_consolidated_data(data = results1, scalar = 100)

mosaic2012.output_data(results2, output_filepath, output_type)