
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Off Canvas Reveal Menu Template for Bootstrap</title>

    <!-- Bootstrap core CSS -->
    <link href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/css/jasny-bootstrap.min.css">
    <!-- Custom styles for this template -->
    <style type ="text/css">
    html, body {
      height: 100%;
    }

    .navbar-toggle {
      float: left;
      margin-left: 15px;
    }

    .navmenu {
      z-index: 1;
    }

    .canvas {
      position: relative;
      left: 0;
      z-index: 2;
      min-height: 100%;
      padding: 50px 0 0 0;
      background: #fff;
    }

    @media (min-width: 0) {
      .navbar-toggle {
        display: block; /* force showing the toggle */
      }
    }

    @media (min-width: 992px) {
      body {
        padding: 0;
      }
      .navbar {
        right: auto;
        background: none;
        border: none;
      }
      .canvas {
        padding: 0;
      }
    }
    </style>


    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>
    <div class="navmenu navmenu-default navmenu-fixed-left">
      <a class="navmenu-brand" href="#">Project name</a>
      <ul class="nav navmenu-nav">
        <li><a href="../navmenu/">Slide in</a></li>
        <li><a href="../navmenu-push/">Push</a></li>
        <li class="active"><a href="./">Reveal</a></li>
        <li><a href="../navbar-offcanvas/">Off canvas navbar</a></li>
      </ul>
      <ul class="nav navmenu-nav">
        <li><a href="#">Link</a></li>
        <li><a href="#">Link</a></li>
        <li><a href="#">Link</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
          <ul class="dropdown-menu navmenu-nav">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li class="divider"></li>
            <li class="dropdown-header">Nav header</li>
            <li><a href="#">Separated link</a></li>
            <li><a href="#">One more separated link</a></li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="canvas">
      <div class="navbar navbar-default navbar-fixed-top">
        <button type="button" class="navbar-toggle" data-toggle="offcanvas" data-recalc="false" data-target=".navmenu" data-canvas=".canvas">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>

      <div class="container">
        <div class="page-header">
          <h1><?=getcwd(); ?></h1>
        </div>
        <p class="lead">This example demonstrates the use of the offcanvas plugin with a reveal effect.</p>
        <p>On the contrary of the push effect, the menu doesn't move with the canvas.</p>
        <p>You get the reveal effect by wrapping the content in a div and setting the <code>canvas</code> option to target that div.</p>
        <p>Note that in this example, the navmenu doesn't have the <code>offcanvas</code> class, but is placed under the canvas by setting the <code>z-index</code>.</p>
        <p>Also take a look at the examples for a navmenu with <a href="../navmenu">slide in effect</a> and <a href="../navmenu-push">push effect</a>.</p>
      </div><!-- /.container -->
    </div>


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/js/jasny-bootstrap.min.js"></script>
  </body>
</html>