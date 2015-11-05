#!/usr/local/bin/python3.1
from mosaicData import MosaicData

data_filepath = "../data/raw_data/Mosaic 2012.csv"
lookup_filepath = "../data/2012_field_lookup_alt.csv"
mapping_filepath = "../data/value_mapping.csv"
cols_with_text = ["SocialFamilyWalfare", "Nature", "CulturalHeritage", "Procurement", "MunicipalRecruitment", "Cleanliness"
                        ,"HighwaysAndRoads", "FundsManagement", "TaxProcedures", "KosovoPolice", "ElectricitySupply"
                        ,"PhoneAndPost", "CemeteryMaintenance"]


mosaic2012 = MosaicData(data_filepath, lookup_filepath, mapping_filepath, cols_with_text)
results1 = mosaic2012.import_data()
results2 = mosaic2012.convert_to_values(results1)
results3 = mosaic2012.aggregate_scores(results2, "Municipality")

#aggregateScores(results2)
results3.to_csv("test_sample.csv")