"use strict";
var bcrypt = require("bcrypt-nodejs");
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require("path");

//Cargar modelo
var Judicial = require("../models/judicial");
var User = require("../models/user");
var jwt = require("../services/jwt");

//Metodo de pruebas
function judicial(req, res) {
  res.status(200).send({
    message: "Accion de test de judicial",
  });
}

//Registro de judicials

function saveJudicial(req, res) {
  var params = req.body;
  var judicial = new Judicial();

  if (params.nombre) {
    judicial.user = req.user.sub;
    judicial.nombre = params.nombre;

    //Judicials duplicados controll
    Judicial.find({

    }).exec((err, judicials) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Error en la petición de Judicial" });

        judicial.save((err, judicialStored) => {
          if (err)
            return res
              .status(500)
              .send({ message: "No se ha podido guardar el usuario" });

          if (judicialStored) {
            res.status(200).send({ judicial: judicialStored });
          } else {
            res.status(404).send({ message: "No se ha registrado el usuario" });
          }
        });
      
    });
  } else {
    res.status(200).send({
      message: "Envia todos los campos necesarios",
    });
  }
}

// Conseguir datos de un perfil laboral

function getJudicial(req, res) {
  var judicialId = req.params.id;

  Judicial.findById(judicialId, (err, judicial) => {
    if (err) return res.status(500).send({ message: "Error en la petición" });

    if (!judicial)
      return res.status(404).send({ message: "El usuario no existe" });
    return res.status(200).send({
      judicial,
    });
  });
}

// Conseguir datos de un perfil laboral de un solo usuario
function getJudicialUser(req, res) {
  var identity_user_Id = req.params.id;

  Judicial.find({ user: identity_user_Id }, (err, judicials) => {
    if (err) return res.status(500).send({ message: "Error en la petición" });

    if (!judicials)
      return res.status(404).send({ message: "El usuario no existe" });
    return res.status(200).send({
      judicials,
    });
  });
}

//Conseguir todos los perfiles laborales

function getJudicials(req, res) {
    var identity_user_id = req.user.sub;
  
    Judicial.find()
      .sort("_id")
      .exec((err, judicials) => {
        if (err)
          return res.status(500).send({ message: "Error al devolver los datos" });
        if (!judicials)
          return res
            .status(404)
            .send({ message: "No exisen usuarios para mostrar" });
  
        return res.status(200).send({
            judicials,
        });
      });
  }

  //Actualizar perfil laboral

  function updateJudicial(req, res) {
    var JudicialId = req.params.id;
    var update = req.body;
  
    Judicial.findByIdAndUpdate(
      judicialId,
      update,
      { new: true },
      (err, judicialUpdated) => {
        if (err)
          return res
            .status(500)
            .send({ message: "Error al actualizar los datos" });
        if (!judicialUpdated)
          return res.status(404).send({ message: "No existe el judicial" });
  
        return res.status(200).send({
          judicial: judicialUpdated,
        });
      }
    );
  }
  
// Subir archivos de imagen/certificado de usuario

function uploadJudicialImage(req, res){
	var certificadoAcademicoId = req.params.id;

	if(req.files){
		var file_path = req.files.certificadoAcademico.path;
		console.log(file_path);
		
		var file_split = file_path.split('\\');
		console.log(file_split);

		var file_name = file_split[2];
		console.log(file_name);

		var ext_split = file_name.split('\.');
		console.log(ext_split);

		var file_ext = ext_split[1];
		console.log(file_ext);

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			 // Actualizar documento de Judicial logueado
			 Judicial.findByIdAndUpdate(certificadoAcademicoId, {certificadoAcademico: file_name}, {new:true}, (err, judicialUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!judicialUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({judicial: judicialUpdated});
			 });

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}

	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}

function getJudicialImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/judicials/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}
module.exports = {
    judicial,
    saveJudicial,
    getJudicial,
    getJudicialUser,
    getJudicials,
    updateJudicial,
    uploadJudicialImage,
    getJudicialImageFile,
};
