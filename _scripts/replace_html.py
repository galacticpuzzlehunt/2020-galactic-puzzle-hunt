import os
import argparse

text = '''<meta property="og:image" content="http://localhost:8000/static/images/hero.min.png">
    <meta property="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/css/skeleton.css">
    <link rel="stylesheet" href="/static/css/base.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.19/jquery.touchSwipe.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.formset/1.2.2/jquery.formset.min.js"></script>
    <script src="/static/js/sorttable.js"></script>
    <script src="/static/js/tray.js"></script>
    <script src="/static/js/notify.js"></script>
    <script src="/static/js/time.js"></script>
    <link rel="icon" sizes="16x16 32x32 48x48 64x64" href="/static/images/favicon.ico" type="image/vnd.microsoft.icon">


</head>
<body>

    <input id="shortcuts" type="checkbox">

    <nav>
        <span class="tray">
            <div class="top-tabs">
                <a href="/">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/home_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/home_small_icon_hover.png)"></span>
                    Home
                </a>
                <a href="/rules">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/rules_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/rules_small_icon_hover.png)"></span>
                    Rules
                </a>

                <a href="/story">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/story_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/story_small_icon_hover.png)"></span>
                    Story
                </a>


                <a class="selected-tab" href="/puzzles">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/puzzles_small_icon.png); background-size: 1.3em; transform: translateX(-3px)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/puzzles_small_icon_hover.png); background-size: 1.3em; transform: translateX(-3px)"></span>
                    Puzzles
                </a>

                <a href="/teams">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/teams_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/teams_small_icon_hover.png)"></span>
                    Teams
                </a>
                <a href="/faq">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/faq_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/faq_small_icon_hover.png)"></span>
                    FAQ
                </a>

                <a href="/errata">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/errata_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/errata_small_icon_hover.png)"></span>
                    Updates
                </a>


                <a href="/wrapup">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/wrapup_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/wrapup_small_icon_hover.png)"></span>
                    Wrap-Up
                </a>

                <a href="/archive">
                    <span class="top-tab-icon" style="background-image: url(/static/images/small_icons/archive_small_icon.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(/static/images/small_icons/archive_small_icon_hover.png)"></span>
                    Archive
                </a>
            </div>
            <div class="top-left-actions">'''
replacement = '''<meta property="og:image" content="https://galacticpuzzlehunt.com/static/images/hero.min.f2764f55466c.png">
    <meta property="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../static/css/skeleton.b7b20ef7c204.css">
    <link rel="stylesheet" href="../static/css/base.079f433df08e.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.19/jquery.touchSwipe.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.formset/1.2.2/jquery.formset.min.js"></script>
    <script src="../static/js/sorttable.3809d26cbae1.js"></script>
    <script src="../static/js/tray.ac18af883297.js"></script>
    <script src="../static/js/notify.7898a6be1e40.js"></script>
    <script src="../static/js/time.4f918ead85cd.js"></script>
    <link rel="icon" sizes="16x16 32x32 48x48 64x64" href="../static/images/favicon.9936c02d5d47.ico" type="image/vnd.microsoft.icon">

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-92192633-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-92192633-1');
</script>


</head>
<body>

    <nav>
        <span class="tray">
            <div class="top-tabs">
                <a href="../index.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/home_small_icon.4d43f3858ff0.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/home_small_icon_hover.6c8436711233.png)"></span>
                    Home
                </a>
                <a href="../rules.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/rules_small_icon.cf639cb0d6f8.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/rules_small_icon_hover.ed667d6e312a.png)"></span>
                    Rules
                </a>

                <a href="../story.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/story_small_icon.f493b7c42114.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/story_small_icon_hover.dc0f6729e801.png)"></span>
                    Story
                </a>


                <a class="selected-tab" href="../puzzles.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/puzzles_small_icon.167a0bd8ef08.png); background-size: 1.3em; transform: translateX(-3px)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/puzzles_small_icon_hover.87c667d84046.png); background-size: 1.3em; transform: translateX(-3px)"></span>
                    Puzzles
                </a>

                <a href="../teams.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/teams_small_icon.ccd9aedd37a8.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/teams_small_icon_hover.b9d0896895b1.png)"></span>
                    Teams
                </a>
                <a href="../faq.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/faq_small_icon.e3d1c39056bd.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/faq_small_icon_hover.f6045c3fc475.png)"></span>
                    FAQ
                </a>

                <a href="../errata.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/errata_small_icon.cf68a4a2a669.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/errata_small_icon_hover.8b76a20f6fbf.png)"></span>
                    Updates
                </a>


                <a href="../wrapup.html">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/wrapup_small_icon.17eed92dc9fc.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/wrapup_small_icon_hover.fc72c96feec4.png)"></span>
                    Wrap-Up
                </a>

                <a href="https://galacticpuzzlehunt.com/archive">
                    <span class="top-tab-icon" style="background-image: url(../static/images/small_icons/archive_small_icon.fcd4097c93e3.png)"></span>
                    <span class="top-tab-hover" style="background-image: url(../static/images/small_icons/archive_small_icon_hover.8d4bebd544bd.png)"></span>
                    Archive
                </a>
            </div>
            <div class="top-left-actions">'''



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
