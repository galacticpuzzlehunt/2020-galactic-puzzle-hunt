import os
import argparse

text = '''        <div class="top-right-actions">


            <a class="team-name" href="/team/fortenforge">fortenforge</a>





            <label for="shortcuts" title="Admin toolbox">Shortcuts</label>


            <a href="/logout" class="btn">Logout</a>

        </div>'''
replacement = '''<div class="top-right-actions"></div>'''



def main(info):
  for root, dirs, files in os.walk(".", topdown=False):
    for name in files:
      if name.endswith('.html'):
        full_path = os.path.join(root, name)
        f = open(full_path, 'r')
        html = f.read()
        f.close()

        if text in html:
          print('Modifying {}'.format(full_path))
          if not info:
            html = html.replace(text, replacement)
            f = open(full_path, 'w')
            f.write(html)
            f.close()


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('-i','--info',
    help='Show which files would be modified', action='store_true')
  args = parser.parse_args()
  main(args.info)
