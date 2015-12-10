#!/usr/local/bin/python3.1
# -*- coding: utf-8 -*-
from mosaicData import MosaicData
import argparse
import json

# Sample Command: python bin/create_data.py --s data/raw_data/satisfied.csv --d data/raw_data/dissatisfied.csv --p data/raw_data/problems.csv --w data/standard_lists/whitelist.xlsx

parser = argparse.ArgumentParser(description='Convert data format for visualizer')
parser.add_argument('--s', type=str)
parser.add_argument('--d', type=str)
parser.add_argument('--p', type=str)
parser.add_argument('--w', type=str)
args = parser.parse_args()

# Indicators Data Update
if args.s:
    mosaicS = MosaicData(data_filepath = args.s, data_type = 'consolidated', sat_or_dis = 's')
    mosaicS.import_consolidated_data()
    mosaicS.transform_consolidated_data(scalar = 100)
    mosaicS.output_data()
    
if args.d: 
    mosaicD = MosaicData(data_filepath = args.d, data_type = 'consolidated', sat_or_dis = 'd')
    mosaicD.import_consolidated_data()
    mosaicD.transform_consolidated_data(scalar = 100)
    mosaicD.output_data()

# Problems Data Update
if args.p:
    mosaicP = MosaicData(data_filepath = args.p, data_type = 'problems')
    mosaicP.import_problems_data()
    mosaicP.transform_problems_data(scalar = 100)
    mosaicP.output_data()

# Standard (white) Lists Updates
if args.w:
    mosaicW = MosaicData(data_filepath = args.w, data_type = 'whitelist')
    mosaicW.regenerate_whitelists()