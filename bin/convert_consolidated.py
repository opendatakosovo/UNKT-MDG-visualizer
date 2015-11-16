#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
from mosaicData import MosaicData
import json

data_filepath = "../data/consolidated_indicators_mod.csv"
output_filepath = "../data/output"
data_type = 'consolidated'


mosaic2012 = MosaicData(data_filepath, data_type)
results1 = mosaic2012.import_consolidated_data()
results2 = mosaic2012.transform_consolidated_data(results1)

mosaic2012.return_json(results2, output_filepath)