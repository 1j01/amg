#!/usr/bin/python
import os
print "Content-Type: text/plain\n\n"
for root, dirs, files in os.walk("content"):
    for file in files:
		if not file.endswith('.md'):
			print os.path.join(root, file)