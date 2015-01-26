#!/usr/bin/env python
import cgi, cgitb, os, base64, re; cgitb.enable()

form = cgi.FieldStorage()
dataUrlPattern = re.compile('^data:image/png;base64,(.*)$')

print 'Content-Type: text/plain\n';

if form.has_key('imagedata'):
	imagedata = form['imagedata'].value
	if form.has_key('fname'):
		fn = form['fname'].value
		fn = 'content/'+os.path.basename(fn)
		match = dataUrlPattern.match(imagedata)
		if match is not None:
			imgb64 = match.group(1)
			if len(imgb64) > 0:
				open(fn, 'wb').write(base64.b64decode(imgb64))
				os.chmod(fn, 0o777);
			else:
				print '@err\nIt didn\'t work.'
		else:
			print '@err\nNot a data:uri'
	else:
		print '@err\nNo form["filename"]'
else:
	print '@err\nNo form["imagedata"]'