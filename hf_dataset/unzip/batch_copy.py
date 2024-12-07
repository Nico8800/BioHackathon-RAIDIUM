import shutil
import os
from pathlib import Path
from typing import List
import time

def copy_files_in_batches(source_dir: str, dest_dir: str, batch_size: int = 1000):
    """
    Copy files from source directory to destination directory in batches.
    
    Args:
        source_dir (str): Source directory path
        dest_dir (str): Destination directory path
        batch_size (int): Number of files to copy in each batch
    
    Returns:
        tuple: (number of files copied, list of failed files)
    """
    source_path = Path(source_dir)
    dest_path = Path(dest_dir)
    
    # Create destination directory if it doesn't exist
    
    # Get list of all files
    files = [f for f in source_path.iterdir() if f.is_file()]
    total_files = len(files)
    
    copied_count = 0
    failed_files = []
    
    # Process files in batches
    for i in range(0, total_files, batch_size):
        batch = files[i:i + batch_size]
        print(f"\nProcessing batch {(i // batch_size) + 1} ({len(batch)} files)")
        
        for source_file in batch:
            dest_file = dest_path / source_file.name
            try:
                shutil.copy2(source_file, dest_file)
                copied_count += 1
                
                # Print progress
                if copied_count % 100 == 0:
                    print(f"Copied {copied_count}/{total_files} files...")
                    
            except Exception as e:
                print(f"Error copying {source_file.name}: {e}")
                failed_files.append((source_file.name, str(e)))
        
        # Small delay between batches to prevent system overload
        time.sleep(0.1)
    
    return copied_count, failed_files

if __name__ == "__main__":
    source_directory = "mimic_dset/re_512_3ch/Valid"  # Your source directory
    destination_directory = "../dataset/data/img"  # Where you want to copy the files
    batch_size = 1000  # Adjust this based on your system
    
    print(f"Starting copy from {source_directory} to {destination_directory}")
    start_time = time.time()
    
    copied, failed = copy_files_in_batches(source_directory, destination_directory, batch_size)
    
    end_time = time.time()
    duration = end_time - start_time
    
    print("\nCopy operation completed!")
    print(f"Total files copied: {copied}")
    print(f"Time taken: {duration:.2f} seconds")
    
    if failed:
        print("\nFailed copies:")
        for file, error in failed:
            print(f"- {file}: {error}")