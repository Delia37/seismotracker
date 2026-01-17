import pandas as pd

# Specify the csv file
csv_file = 'building_list.csv'
# Specify the text file
txt_file = 'coordinates.txt'

# Read the csv file using pandas
df = pd.read_csv(csv_file)

# Read the text file
with open(txt_file, 'r') as f:
    text_data = f.readlines()

# Strip the newline character from each line
text_data = [line.strip() for line in text_data]

# Split each line on the comma
text_data = [line.split(',') for line in text_data]

# Add the data from the text file as a new column in the csv
df["Latitude"] = [line[0] for line in text_data]
df["Longitude"] = [line[1] for line in text_data]

# Save the updated dataframe back to csv
df.to_csv(csv_file, index=False)