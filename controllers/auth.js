const { response, json } = require("express");
const bcryptjs = require ('bcryptjs')


const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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


const googleSignIN = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {

        //const googleUser = await googleVerify( id_token );
        //console.log(googleUser)

        const { nombre, img, correo} = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();

        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id_token );


        res.json({
           usuario,
           token
        });


    } catch (error) {

        console.log(error)

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

   
}



module.exports = {
    login,
    googleSignIN
}