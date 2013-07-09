#!/usr/bin/python
import cgi, os
import cgitb; cgitb.enable()

form = cgi.FieldStorage()

# A nested FieldStorage instance holds the file
if form.has_key('file'):
	fileitem = form['file']
	# Test if the file was uploaded
	fname = fileitem.filename
	if fname:
	   fn = os.path.basename(fname)
	   open('content/' + fn, 'wb').write(fileitem.file.read())
	   message = 'The file "' + fn + '" was uploaded successfully'
	else:
	   message = 'No form["file"].filename'
else:
	message = 'No form["file"]'
   
print """\
Content-Type: text/html\n
<html><body>
<p>%s</p>
</body></html>
""" % (message)

print form