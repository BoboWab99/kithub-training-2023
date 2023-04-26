
# python basics

"""
   - python basics
   - data types
   - operations
   - strings & string functions
   - lists
   - tuples
   - sets
   - dictionaries
   - oop basics
"""

# @TODO read the Python Tutorial and SQL Tutorial on https://w3schools.com
# feel free to use any other site, watch YouTube videos if you're a lover
# The idea is to familiarize yourself with Python and Databases (Database Systems)

def add(a, b):
   print(f"{a} + {b} = {a + b}")
   return a + b

a = int(input("Input first number: "))
b = int(input("Input last number: "))
add(a, b)