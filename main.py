import csv
import argparse
from dotenv import load_dotenv

from back.diagnosis import search_for_diagnostics, extract_sections
from back.extract_demographics import subset_and_transform

def main():
    load_dotenv()

    parser = argparse.ArgumentParser(description="Read a specific line from a CSV file.")
    parser.add_argument(
        "file_path",
        type=str,
        help="Path to the CSV file.",
    )
    parser.add_argument(
        "line_number",
        type=int,
        help="The line number to read",
    )

    args = parser.parse_args()

    # Read the specified line from the CSV file
    PatientCharacteristics = subset_and_transform(args.file_path, args.line_number)
    symptoms = PatientCharacteristics.split(',')[-1]
    characteristics = PatientCharacteristics.split(',')[:-1]
    Diagnosis = search_for_diagnostics(symptoms,characteristics)
    diagnostic_proposal, medical_suggestion = extract_sections(Diagnosis)

    print(diagnostic_proposal,medical_suggestion)

if __name__ == "__main__":
    main()