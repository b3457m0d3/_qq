<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="shortcut icon" href="">
        <title>A quote request has been made</title>

        <!-- Bootstrap core CSS -->
        <link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
        <link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css" rel="stylesheet">
		<link rel="stylesheet" id="font-awesome" type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.css" />
		<link rel='stylesheet' id='google-web-fonts'  href='http://fonts.googleapis.com/css?family=Lobster|Open+Sans:300,300italic,regular,italic,600,600italic,800|Oswald:300,300italic,regular,italic,600,600italic&#038;subset=latin' type='text/css' media='all' />
        <!-- Custom styles for this template -->
        <style>
			body{padding-top:50px;}
			.lobster { font-family:"Lobster"; }
			.open-sans { font-family:"Open Sans"; font-weight:300; }
			.ssp-blue { color:#1085c2; }
			.grey { color:#949494; }
		</style>

        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>

    <body>
        <div class="container-fluid">
			<h1 class="lobster ssp-blue text-right">Incoming Quote Request</h1>
			<table>
				<tr>
					<td>
						<p class="lead">
							<span class="open-sans grey">From:</span>
							{{=ucfirst($fName)}} {{=ucfirst($lName)}}
						</p>
					</td>
					<td>
						{{ if($company !== ""){ }}
							<p class="lead">
								<span class="open-sans grey">With:</span>
								<i class="fa fa-institution fa-fw ssp-blue"></i>
								{{=ucfirst($company)}}
							</p>
						{{ } }}
					</td>
				</tr>
			</table>
			<table width="100%">
				<tr>
					<td>
						<h3 class="open-sans">Contact Info</h3>
						<p class="lead">
							<i class="fa fa-phone fa-fw ssp-blue"></i> {{=$phone}}
							<br>
						    <i class="fa fa-inbox fa-fw ssp-blue"></i> {{=$email}}
					    </p>
					</td>
					<td>
						<h3 class="open-sans">Billing Address</h3>
						<p class="lead">
							{{=ucwords($add1B)}} {{=strtoupper($add2B)}} {{=ucfirst($cityB)}}, {{=strtoupper($stateB)}} {{=$zipB}}
						</p>

						{{ if(!isset($pickup) && $add1 != ""){ }}
							<h3 class="open-sans">Shipping Address</h3>
							<p class="lead">
								{{=ucwords($add1)}} {{=strtoupper($add2)}} {{=ucfirst($city)}}, {{=strtoupper($state)}} {{=$zip}}
							</p>
						{{ } }}
						{{ if(isset($deadline) && $deadline != ""){ }}
							<h3 class="open-sans">Deadline</h3>
							<p class="lead">
								<i class="fa fa-calendar fa-fw ssp-blue"></i> {{=$deadline}}
							</p>
						{{ } }}
					</td>
				</tr>
			</table>
			{{ __::each($items, function($num,$index) { }}
				<div id='item_{{=$index}}'>
					<h2 class="lobster grey">
						{{=ucfirst($num['product'])}}
						<small class="open-sans ssp-blue">
							{{ if($num['brand'] != ''){ }}
								{{=$num['brand']}}
							{{ } }}

							{{ if($num['blend'] != ''){ }}
								/ {{=$num['blend']}}
							{{ } }}
						</small>
					</h2>
					<table width="100%">
						<thead>
							<tr>
								<th>
									<h3 class="open-sans">Artwork</h3>
								</th>
								<th>
									<h3 class="open-sans">Locations</h3>
								</th>
								<th>
									<h3 class="open-sans">Colors &amp; Sizes</h3>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									{{=$num['art']}}
									{{ if($num['vect']){ }}
										<br>
										<i class="fa fa-check fa-2x ssp-blue"></i> Has Vector Art
									{{ } }}
								</td>
								<td>
									<i class="fa fa-map-marker fa-2x ssp-blue"></i>{{=$num['loc']}}
								</td>
								<td>
									<table class="table table-striped" width="100%">
											<thead>
											<tr>
												<th><span class="badge">Total</span></th>
												<th>Color</th>
												<th>XS</th>
												<th>S</th>
												<th>M</th>
												<th>L</th>
												<th>XL</th>
												<th>XXL</th>
											</tr>
										</thead>
										<tbody>

											{{ $x = __::size($num['qtys']); }}
											{{ if($index<=$x){ }}
												{{ if($x>1){ }}
													{{__::each($num['qtys'], function($qtys){ }}
														{{ extract(__::toArray($qtys)); }}
														<tr>
															<td>{{=$total}}</td>
															<td>{{=$swatch}}</td>
															{{ __::each($qtys['sizes'], function($size){ }}
																<td>{{=$size}}</td>
															{{ }); }}
														</tr>
													{{ }); }}
												{{ } else { }}
													{{extract(__::toArray($num['qtys'][0]));}}
													<tr>
														<td style="text-align:center;">{{=$total}}</td>
														<td style="text-align:center;">{{=$swatch}}</td>
														{{ __::each($sizes, function($size){ }}
															<td style="text-align:center;">
																{{ if($size == ''){ }}
																	0
																{{ } else { }}
																	{{=$size}}
																{{ } }}
															</td>
														{{ }); }}
													</tr>
												{{ } }}
											{{ } }}
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<hr>
			{{	});	}}
        </div>
    </body>
</html>
