const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstacionesSchema = new Schema({
    'CLAVE ESTADO':     { type: Number },
    INDICE:             { type: Number },
    ESTADO:             { type: String },
    CARRETERA:          { type: String },
    'CLAVE CARRETERA':  { type: Number },
    RUTA:               { type: String },
    'PUNTO GENERADOR':  { type: String },
    TIPO:               { type: Number },
    SC:                 { type: Number },
    KM:                 { type: Number },
    TDPA2022:           { type: Number },
    TDPA2021:           { type: Number },
    TDPA2020:           { type: Number },
    TDPA2019:           { type: Number },
    TDPA2018:           { type: Number },
    TDPA2017:           { type: Number },
    TDPA2016:           { type: Number },
    TDPA2015:           { type: Number },
    TDPA2014:           { type: Number },
    TDPA2013:           { type: Number },
    TDPA2012:           { type: Number },
    TDPA2011:           { type: Number },
    TDPA2010:           { type: Number },
    M:                  { type: Number },
    A:                  { type: Number },
    B:                  { type: Number },
    C2:                 { type: Number },
    C3:                 { type: Number },
    T3S2:               { type: Number },
    T3S3:               { type: Number },
    T3S2R4:             { type: Number },
    OTROS:              { type: Number },
    AA:                 { type: Number },
    BB:                 { type: Number },
    CC:                 { type: Number },
    D:                  { type: Number },
    'K\'':              { type: Number },
    LAT:                { type: Number },
    LONG:               { type: Number },
    loc: {
        type:           { type: String },
        coordinates:    []
    },
    CLAVE_E_DV:         { type: Number },
    variacion:          {
        "lun":          { type: Number },
        "mar":          { type: Number },
        "mie":          { type: Number },
        "jue":          { type: Number },
        "vie":          { type: Number },
        "sab":          { type: Number },
        "dom":          { type: Number }
    },
    rubro:              { type: String },
    TDPA2009:           { type: Number },
}, {
    versionKey: false,
    retainKeyOrder: true
});

const emp = mongoose.model('estaciones', EstacionesSchema, 'estaciones');
module.exports = emp;