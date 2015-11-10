require(foreign, quietly = TRUE)
require(memisc, quietly = TRUE)

#filepath <-  "/Users/brettromero/Documents/Open_Data/kosovo-mosaic-importer/data/raw_data/LocalAuthorities&PublicServices_Kosovo2003.sav"
filepath <-  "/Users/brettromero/Documents/Open_Data/kosovo-mosaic-importer/data/raw_data/Mosaic_W2_2006_VFF_Lab_last_SES.sav"

data <- as.data.set(spss.system.file(filepath))
data <- as.data.frame(data)
new.filepath <- paste0(substring(filepath, 1, nchar(filepath, type = "chars") - 4), ".csv")
write.csv(data, new.filepath, row.names = FALSE)
