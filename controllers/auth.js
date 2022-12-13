const { response } = require("express");
const bcryptjs = require ('bcryptjs')


const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");

//los controladores solo son funciones

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            });
        }

        //si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            });
        }


        //verificar la password
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            });
        }

        // generar el JWT
        const token = await generarJWT ( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "hable con el admin"
        });
    }
    

    
  
}



module.exports = {
    login
}