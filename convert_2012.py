#!/usr/local/bin/python3.1
import pandas as pd

filepath = "data/Mosaic 2012.csv"
data = pd.read_csv(filepath, header=0, delimiter=",", quoting=1, index_col=0)



print(data)