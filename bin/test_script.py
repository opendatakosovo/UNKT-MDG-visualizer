#!/usr/local/bin/python3.1
from mosaicData import MosaicData

data_filepath = "../data/raw_data/2012messed.csv"
mapping_filepath = "../data/mapping/2012.csv"
values_filepath = "../data/values.csv"
value_method = 'score'


mosaic2012 = MosaicData(data_filepath, mapping_filepath, values_filepath)
results1 = mosaic2012.import_data()
results2 = mosaic2012.convert_to_values(results1, value_method)
results3 = mosaic2012.aggregate_scores(results2, "Municipality")

#aggregateScores(results2)
results3.to_csv("../data/test_sample.csv")