const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CasetaSchema = new Schema({
    Movimiento : { type: String },
    Km :         { type: Number },
    Sen :        { type: Number },
    Ruta :       { type: String },
    M :          { type: Number },
    A :          { type: Number },
    AR :         { type: Number },
    B :          { type: Number },
    C2 :         { type: Number },
    C3 :         { type: Number },
    C4 :         { type: Number },
    C5 :         { type: Number },
    C6 :         { type: Number },
    C7 :         { type: Number },
    C8 :         { type: Number },
    C9 :         { type: Number },
    VNC :        { type: Number },
    VTA :        { type: Number },
    Ene :        { type: Number },
    Feb :        { type: Number },
    Mar :        { type: Number },
    Abr :        { type: Number },
    May :        { type: Number },
    Jun :        { type: Number },
    Jul :        { type: Number },
    Ago :        { type: Number },
    Sep :        { type: Number },
    Oct :        { type: Number },
    Nov :        { type: Number },
    Dic :        { type: Number },
    Lat :        { type: Number },
    Lon :        { type: Number },
    Zona_Geo :   { type: String },
    X_PG :       { type: Number },
    Y_PG :       { type: Number },
    TDPA2022 :   { type: Number },
    TDPA2021 :   { type: Number },
    TDPA2020 :   { type: Number },
    TDPA2019 :   { type: Number },
    TDPA2018 :   { type: Number },
    TDPA2017 :   { type: Number },
    TDPA2016 :   { type: Number },
    TDPA2015 :   { type: Number },
    TDPA2014 :   { type: Number },
    TDPA2013 :   { type: Number },
    TDPA2012 :   { type: Number },
    TDPA2011 :   { type: Number },
    TDPA2010 :   { type: Number },
    TDPA2009 :   { type: Number },
    Cve :        { type: String },
    Caseta :     { type: String },
    Carretera :  { type: String },
    loc :        {
        type :   { type: String },
        coordinates : []
    },
    Estado : [],
    rubro :      { type: String }
}, {
    versionKey: false,
    retainKeyOrder: true
});

const emp = mongoose.model('estaciones', CasetaSchema, 'estaciones');
module.exports= emp;