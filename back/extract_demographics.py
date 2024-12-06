import pandas as pd

def subset_and_transform(file_path, line, columns=['PatientAge', 'PatientGender', 'Indication'], new_column_name='PatientCaracteristics'):
    """
    Extract a subset of columns from a CSV, transform values, and add a new concatenated column for a specific line.
    
    Parameters:
    - file_path (str): Path to the CSV file.
    - line (int): Line number to extract and process.
    - columns (list): List of column names to subset.
    - new_column_name (str): Name of the new column with concatenated strings. Default is 'PatientCaracteristics'.
    
    Returns:
    - str: A string representation of the concatenated column for the specified line.
    """
    # Load the CSV file
    data = pd.read_csv(file_path)

    # Validate the line number
    if line < 1 or line > len(data):
        raise ValueError(f"Line {line} is out of range. The file contains {len(data)} lines.")

    # Create the subset DataFrame
    subset_data = data[columns].copy()

    # Transform 'PatientAge' into an integer with " ans" appended
    if 'PatientAge' in columns:
        subset_data['PatientAge'] = subset_data['PatientAge'].fillna(0).astype(int).astype(str) + " ans"

    # Transform 'PatientGender' to "Homme" or "Femme"
    if 'PatientGender' in columns:
        subset_data['PatientGender'] = subset_data['PatientGender'].replace({'M': 'Homme', 'F': 'Femme'})

    # Add a new column with concatenated strings
    subset_data[new_column_name] = subset_data.apply(lambda row: ','.join(row.values.astype(str)), axis=1)

    # Retrieve the PatientCaracteristics for the specified line
    return subset_data.loc[line - 1, new_column_name]  # Convert 1-based index to 0-based index

# Example usage
file_path = '/Users/nico/Downloads/CASIA-CXR_Sample/CASIA-CXR_Mass_Sample/CASIA-CXR_Mass_Reports.csv'  # Replace with your file path
line = 3  # Specify the line number (1-based index)

columns = ['PatientAge', 'PatientGender', 'Indication']
try:
    result = subset_and_transform(file_path, line, columns)
    print(f"PatientCaracteristics for line {line}: {result}")
except ValueError as e:
    print(e)