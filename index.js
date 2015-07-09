var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require('cloudinary');
var app_password = "viejito79"

cloudinary.config({
	cloud_name: "accecar",
	api_key: "581627995675862",
	api_secret: "y2jQCRNi1-UVx2n552vEi8Yywoc"
});

var app = express();
/*
mongoose.connect("mongodb://localhost/accecar");*/
mongoose.connect("mongodb://accecar:accecar@ds051110.mongolab.com:51110/accecar");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({dest: "./uploads"}));

var productSchema = {
	title: String,
	description: String,
	imageUrl: String,
	pricing: Number
};

var Product = mongoose.model("Product",productSchema);

app.set("view engine","jade");

app.use(express.static("public"));

/*Se Muestran los datos en el Index*/
app.get("/",function(req,res){
	Product.find(function(error,documento){
		if(error){console.log(error);}
		res.render("index",{ products: documento })
	});
});
/*Se elimina el registro indicado*/

/*Se entra al Panel de Control por Contraseña*/
app.post("/admin",function(req,res){
	if(req.body.password == app_password){
		Product.find(function(error,documento){
		if(error){console.log(error);}
		res.render("admin/index",{products: documento})
		});
	} else {
		res.redirect("/");
	}
});

app.get("/admin",function(req,res){
	res.render("admin/form");
});
/*Se Guardan los datos enviados en la base de dato MongoDB*/
app.post("/",function(req,res){
	if(req.body.password == app_password){
		var data = {
				title: req.body.title,
				description: req.body.description,
				imageUrl:"data.png",
				pricing: req.body.pricing
		}

		var product = new Product(data);

		cloudinary.uploader.upload(req.files.image_avatar.path,
			function(result) { 
				product.imageUrl = result.url;

				product.save(function(err){	
					console.log(product);
					res.render("init");
				});
			}
		);
		
	}else{
		res.render("prod/new");
	}

});

app.get("/prod",function(req,res){
	res.render("prod/new")
});

/*app.listen(8080);*/
app.listen(process.env.PORT || 5000)
