'use strict';

var ADODB = require('node-adodb');
ADODB.debug = true;
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/datosTest2023');

var APIs = {
  getEdoName: async (estado) => {
    var edo = "";
    switch (estado) {
      case 'A G U A S C A L I E N T E S':
        edo = "Aguascalientes";
        break;
      case 'B A J A  C A L I F O R N I A':
        edo = "Baja California";
        break;
      case 'B A J A  C A L I F O R N I A  S U R':
        edo = "Baja California Sur";
        break;
      case 'C A M P E C H E':
        edo = "Campeche";
        break;
      case 'C H I A P A S':
        edo = "Chiapas";
        break;
      case 'C H I H U A H U A':
        edo = "Chihuahua";
        break;
      case 'C O A H U I L A':
        edo = "Coahuila";
        break;
      case 'C O L I M A':
        edo = "Colima";
        break;
      case 'C I U D A D   D E   M E X I C O':
        edo = "Ciudad de Mexico";
        break;
      case 'D U R A N G O':
        edo = "Durango";
        break;
      case 'G U A N A J U A T O':
        edo = "Guanajuato";
        break;
      case 'G U E R R E R O':
        edo = "Guerrero";
        break;
      case 'H I D A L G O':
        edo = "Hidalgo";
        break;
      case 'J A L I S C O':
        edo = "Jalisco";
        break;
      case 'M E X I C O':
        edo = "Mexico";
        break;
      case 'M I C H O A C A N':
        edo = "Michoacan";
        break;
      case 'M O R E L O S':
        edo = "Morelos";
        break;
      case 'N A Y A R I T':
        edo = "Nayarit";
        break;
      case 'N U E V O  L E O N':
        edo = "Nuevo Leon";
        break;
      case 'O A X A C A':
        edo = "Oaxaca";
        break;
      case 'P U E B L A':
        edo = "Puebla";
        break;
      case 'Q U E R E T A R O':
        edo = "Queretaro";
        break;
      case 'Q U I N T A N A  R O O':
        edo = "Quintana Roo";
        break;
      case 'S A N  L U I S  P O T O S I':
        edo = "San Luis Potosi";
        break;
      case 'S I N A L O A':
        edo = "Sinaloa";
        break;
      case 'S O N O R A':
        edo = "Sonora";
        break;
      case 'T A B A S C O':
        edo = "Tabasco";
        break;
      case 'T A M A U L I P A S':
        edo = "Tamaulipas";
        break;
      case 'T L A X C A L A':
        edo = "Tlaxcala";
        break;
      case 'V A R I O S':
        edo = "Varios";
        break;
      case 'V E R A C R U Z':
        edo = "Veracruz";
        break;
      case 'Y U C A T A N':
        edo = "Yucatan";
        break;
      case 'Z A C A T E C A S':
        edo = "Zacatecas";
        break;
    }
    return edo;

  },
  getFormatCVE: async (cve) => {
    var cve_Carretera = "";
    if (cve.length < 3) {
      var tmp = "";
      for (var y = cve.length; y < 3; y++) {
        tmp += "0";
      }
      cve = tmp + cve;
    } else {
      cve_Carretera = cve
    }
    return cve_Carretera;

  },
  getAccessDB: async (req, res) => {
    const tipo = req.query.tipo;
    const ruta = req.query.ruta;
    const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + ruta + ';Persist Security Info=False;');

    try {
      var db2, formating, mod, modelo;
      if (tipo == "casetas") {
        mod = require('../models/casetas');
        const data_libro = await connection.query('SELECT * FROM [Datos Libro]');
        const EDO_PASA_CASETAS = await connection.query('SELECT * FROM [EDO PASA CASETAS]');
        const EDOS = await connection.query('SELECT * FROM EDOS');
        var ECMatch = await APIs.EstadosCasetaMatch(EDOS, EDO_PASA_CASETAS);
        var DCMatch = await APIs.DataCasetaMatch(ECMatch, data_libro);
        formating = await APIs.FormatingDataCasetas(DCMatch);
        await APIs.saving(formating, mod);
        await db.disconnect();
        db2 = mongoose.connect('mongodb://localhost:27017/dv2022');
        modelo = require('../models/casetas_bf');
      } else {
        mod = require('../models/estaciones');
        const GUIA_19 = await connection.query('SELECT * FROM [GUIA 19]');
        formating = await APIs.FormatingDataEstaciones(GUIA_19);
        await APIs.saving(formating, mod);
        await db.disconnect();
        db2 = mongoose.connect('mongodb://localhost:27017/dv2022');
        modelo = require('../models/estaciones_bf');
      }
      var tdpa = await APIs.getOldTDPA(formating, modelo, tipo)
      await db2.disconnect();

      var dbagain = mongoose.connect('mongodb://localhost:27017/datosTest2023');
      await APIs.updating(tdpa, mod, tipo)
      await dbagain.disconnect();


      res.json({ "result": "success" })
      res.end();

    } catch (error) {
      console.error(error);
      res.json({ "result": "error" })
      res.end();
    }

  },
  EstadosCasetaMatch: async (EDOS, EDO_PASA_CASETAS) => {
    var obj = [];
    for (var i = 0; i < EDO_PASA_CASETAS.length; i++) {
      var rData = {
        "CARRETERA": EDO_PASA_CASETAS[i].CARRETERA,
        "EDO_PASA": EDO_PASA_CASETAS[i].EDO_PASA,
        "ESTADO": EDOS.find(e => e['MínDeCLAVE ESTADO'] == EDO_PASA_CASETAS[i]['EDO_PASA']).ESTADO
      }
      obj.push(rData);
    }
    return obj;
  },
  DataCasetaMatch: async (ECMatch, data_libro) => {
    for (var i = 0; i < data_libro.length; i++) {
      var cve_edo = ECMatch.find(e => e.CARRETERA == data_libro[i]["NOMBRE DE LA CARR CAPUFE:"]).EDO_PASA;
      var edo = ECMatch.find(e => e.CARRETERA == data_libro[i]["NOMBRE DE LA CARR CAPUFE:"]).ESTADO;
      try {
        data_libro[i]['cve_edo'] = cve_edo
        data_libro[i]['edo'] = edo
        data_libro[i]['rubro'] = 'casetas'
      }
      catch (err) {
        console.log("NO: " + i);
      }
    }
    return data_libro;
  },
  FormatingDataCasetas: async (data) => {
    var obj = []
    for (var i = 0; i < data.length; i++) {
      var rData = {}
      rData.Movimiento = data[i]["Movimiento"];
      rData.Km = data[i]["Km_Carr_Capufe"];
      rData.Sen = data[i]["Sentido"];
      rData.Ruta = data[i]["Num_Ruta"];
      rData.M = data[i]["M"];
      rData.A = data[i]["A"];
      rData.AR = data[i]["AR"];
      rData.B = data[i]["B"];
      rData.C2 = data[i]["C2"];
      rData.C3 = data[i]["C3"];
      rData.C4 = data[i]["C4"];
      rData.C5 = data[i]["C5"];
      rData.C6 = data[i]["C6"];
      rData.C7 = data[i]["C7"];
      rData.C8 = data[i]["C8"];
      rData.C9 = data[i]["C9"];
      rData.VNC = data[i]["VNC"];
      rData.VTA = data[i]["VTA"];
      rData.Ene = data[i]["Ene"];
      rData.Feb = data[i]["Feb"];
      rData.Mar = data[i]["Mar"];
      rData.Abr = data[i]["Abr"];
      rData.May = data[i]["May"];
      rData.Jun = data[i]["Jun"];
      rData.Jul = data[i]["Jul"];
      rData.Ago = data[i]["Ago"];
      rData.Sep = data[i]["Sep"];
      rData.Oct = data[i]["Oct"];
      rData.Nov = data[i]["Nov"];
      rData.Dic = data[i]["Dic"];
      rData.Lat = data[i]["Lat"];
      rData.Lon = data[i]["Lon"];
      rData.Zona_Geo = data[i]["Zona Geo"];
      rData.X_PG = data[i]["X"];
      rData.Y_PG = data[i]["Y"];
      rData.TDPA2022 = data[i]["TDPA"];
      rData.TDPA2021 = "";
      rData.TDPA2020 = "";
      rData.TDPA2019 = "";
      rData.TDPA2018 = "";
      rData.TDPA2017 = "";
      rData.TDPA2016 = "";
      rData.TDPA2015 = "";
      rData.TDPA2014 = "";
      rData.TDPA2013 = "";
      rData.TDPA2012 = "";
      rData.TDPA2011 = "";
      rData.TDPA2010 = "";
      rData.TDPA2009 = "";
      rData.Cve = await APIs.getFormatCVE(data[i]["CVE DE LA CARR DE CAPUFE:"]);
      rData.Caseta = data[i]["NOMBRE DE LA ESTACION:"];
      rData.Carretera = data[i]["NOMBRE DE LA CARR CAPUFE:"];
      rData.loc = {
        "type": "Point",
        "coordinates": [
          data[i].Lon,
          data[i].Lat
        ]
      };
      rData.Estado = [await APIs.getEdoName(data[i]["edo"])];
      rData.rubro = "casetas";

      obj.push(rData);
    }
    return obj;
  },
  FormatingDataEstaciones: async (data) => {
    var obj = []
    for (var i = 0; i < data.length; i++) {
      var rData = {}
      rData['CLAVE ESTADO'] = data[i]['CLAVE ESTADO'];
      rData['INDICE'] = data[i]['NUMERO'];
      rData['ESTADO'] = await APIs.getEdoName(data[i]["PASA POR"]);
      rData['CARRETERA'] = data[i]['CARRETERA'];
      rData['CLAVE CARRETERA'] = data[i]['CLAVE CARRETERA'];
      rData['RUTA'] = data[i]['RUTA'];
      rData['PUNTO GENERADOR'] = data[i]['PUNTO GENERADOR'];
      rData['TIPO'] = data[i]['TIPO'] !== "" && data[i]['TIPO'] !== null ? parseInt(data[i]['TIPO']) : null;
      rData['SC'] = data[i]['SENTIDO'] !== "" && data[i]['SENTIDO'] !== null ? parseInt(data[i]['SENTIDO']) : null;
      rData['KM'] = data[i]['KM'] !== "" && data[i]['KM'] !== null ? parseInt(data[i]['KM']) : null;
      rData['TDPA2022'] = data[i]['TDPA2010'] !== "" && data[i]['TDPA2010'] !== null ? parseInt(data[i]['TDPA2010']) : null;
      rData['TDPA2021'] = "";
      rData['TDPA2020'] = "";
      rData['TDPA2019'] = "";
      rData['TDPA2018'] = "";
      rData['TDPA2017'] = "";
      rData['TDPA2016'] = "";
      rData['TDPA2015'] = "";
      rData['TDPA2014'] = "";
      rData['TDPA2013'] = "";
      rData['TDPA2012'] = "";
      rData['TDPA2011'] = "";
      rData['TDPA2010'] = "";
      rData['M'] = data[i]['GUIA 19.TDPA2010.M'] !== "" && data[i]['GUIA 19.TDPA2010.M'] !== null ? parseFloat(data[i]['GUIA 19.TDPA2010.M']) : null;
      rData['A'] = data[i]['A'] !== "" && data[i]['A'] !== null ? parseFloat(data[i]['A']) : null;
      rData['B'] = data[i]['B'] !== "" && data[i]['B'] !== null ? parseFloat(data[i]['B']) : null;
      rData['C2'] = data[i]['C2'] !== "" && data[i]['C2'] !== null ? parseFloat(data[i]['C2']) : null;
      rData['C3'] = data[i]['C3'] !== "" && data[i]['C3'] !== null ? parseFloat(data[i]['C3']) : null;
      rData['T3S2'] = data[i]['T3S2'] !== "" && data[i]['T3S2'] !== null ? parseFloat(data[i]['T3S2']) : null;
      rData['T3S3'] = data[i]['T3S3'] !== "" && data[i]['T3S3'] !== null ? parseFloat(data[i]['T3S3']) : null;
      rData['T3S2R4'] = data[i]['T3S2R4'] !== "" && data[i]['T3S2R4'] !== null ? parseFloat(data[i]['T3S2R4']) : null;
      rData['OTROS'] = data[i]['OTROS'] !== "" && data[i]['OTROS'] !== null ? parseFloat(data[i]['OTROS']) : null;
      rData['AA'] = data[i]['AA'] !== "" && data[i]['AA'] !== null ? parseFloat(data[i]['AA']) : null;
      rData['BB'] = data[i]['BB'] !== "" && data[i]['BB'] !== null ? parseFloat(data[i]['BB']) : null;
      rData['CC'] = data[i]['CC'] !== "" && data[i]['CC'] !== null ? parseFloat(data[i]['CC']) : null;
      rData['D'] = data[i]['GUIA 19.TDPA2010.D'] !== "" && data[i]['GUIA 19.TDPA2010.D'] !== null ? parseFloat(data[i]['GUIA 19.TDPA2010.D']) : null;
      rData['K\''] = data[i]['K\''] !== "" && data[i]['K\''] !== null ? parseFloat(data[i]['K\'']) : null;
      rData['LAT'] = data[i]['LAT'] !== "" && data[i]['LAT'] !== null ? parseFloat(data[i]['LAT']) : null;
      rData['LONG'] = data[i]['LONG'] !== "" && data[i]['LONG'] !== null ? parseFloat(data[i]['LONG']) : null;
      rData['loc'] = {
        "type": "Point",
        "coordinates": [
          rData['LONG'],
          rData['LAT']
        ]
      };
      rData['CLAVE_E_DV'] = data[i]['CLAVE ESTACION'] !== "" && data[i]['CLAVE ESTACION'] !== null ? parseFloat(data[i]['CLAVE ESTACION']) : null;
      rData['variacion'] = {
        "lun": data[i]['L'] !== "" && data[i]['L'] !== null ? parseFloat(data[i]['L']) : "",
        "mar": data[i]['HIST.M'] !== "" && data[i]['HIST.M'] !== null ? parseFloat(data[i]['HIST.M']) : "",
        "mie": data[i]['MI'] !== "" && data[i]['MI'] !== null ? parseFloat(data[i]['MI']) : "",
        "jue": data[i]['J'] !== "" && data[i]['J'] !== null ? parseFloat(data[i]['J']) : "",
        "vie": data[i]['V'] !== "" && data[i]['V'] !== null ? parseFloat(data[i]['V']) : "",
        "sab": data[i]['S'] !== "" && data[i]['S'] !== null ? parseFloat(data[i]['S']) : "",
        "dom": data[i]['HIST.D'] !== "" && data[i]['HIST.D'] !== null ? parseFloat(data[i]['HIST.D']) : ""
      },
        rData.rubro = "estaciones";
      obj.push(rData);
    }
    return obj;
  },
  saving: async (docs, tipo) => {
    console.log("Running");
    await tipo.insertMany(docs, (err) => function () {
      if (err) {
        return console.log(err)
      } else {
        console.log("success");
      }
    });
  },
  getOldTDPA: async (docs, modelo, tipo) => {
    console.log("Adding TDPA");
    var tdpas = []
    for (let i = 0; i < docs.length; i++) {
      var filter = {}
      if (tipo == "casetas") {
        if (docs[i].Cve === "" || docs[i].Cve === undefined || docs[i].Cve == null) { } else {
          filter.Cve = docs[i].Cve
        }
        /*if (docs[i].Caseta === "" || docs[i].Caseta === undefined || docs[i].Caseta == null) { } else {
          filter.Caseta = docs[i].Caseta
        }*/
        if (docs[i].Carretera === "" || docs[i].Carretera === undefined || docs[i].Carretera == null) { } else {
          filter.Carretera = docs[i].Carretera
        }

      } else {
        if (docs[i]['CARRETERA'] === "" || docs[i]['CARRETERA'] === undefined || docs[i]['CARRETERA'] == null) { } else {
          filter["CARRETERA"] = docs[i]['CARRETERA']
        }
        if (docs[i]['CLAVE CARRETERA'] === "" || docs[i]['CLAVE CARRETERA'] === undefined || docs[i]['CLAVE CARRETERA'] == null) { } else {
          filter["CLAVE CARRETERA"] = isNaN(parseFloat(docs[i]['CLAVE CARRETERA'])) ? 0 : parseFloat(docs[i]['CLAVE CARRETERA'])
        }
        if (docs[i]['PUNTO GENERADOR'] === "" || docs[i]['PUNTO GENERADOR'] === undefined || docs[i]['PUNTO GENERADOR'] == null) { } else {
          filter["PUNTO GENERADOR"] = docs[i]['PUNTO GENERADOR']
        }
        if (docs[i]['CLAVE_E_DV'] === "" || docs[i]['CLAVE_E_DV'] === undefined || docs[i]['CLAVE_E_DV'] == null) { } else {
          filter["CLAVE_E_DV"] = isNaN(parseFloat(docs[i]['CLAVE_E_DV'])) ? 0 : parseFloat(docs[i]['CLAVE_E_DV'])
        }
      }
      filter.rubro = docs[i].rubro;

      try {
        var tdpa = await modelo.find(filter)
        if (tdpa.length == 1) {
          tdpas.push(tdpa);
        } /*else {
          console.log(i);
        }*/
      } catch (error) {
        console.log(i);
      }
    }
    return tdpas;
  },
  updating: async (docs, modelo, tipo) => {
    console.log("now updating");
    for (var i = 0; i < docs.length; i++) {
      var filter = {};
      var set = {};
      var variacion = {};
      try {
        if (tipo == "casetas") {
          if (docs[i][0].Cve === "" || docs[i][0].Cve === undefined || docs[i][0].Cve == null) { } else {
            filter.Cve = docs[i][0].Cve
          }
          /*if (docs[i][0].Caseta === "" || docs[i][0].Caseta === undefined || docs[i][0].Caseta == null) { } else {
            filter.Caseta = docs[i][0].Caseta
          }*/
          if (docs[i][0].Carretera === "" || docs[i][0].Carretera === undefined || docs[i][0].Carretera == null) { } else {
            filter.Carretera = docs[i][0].Carretera
          }

        } else {
          if (docs[i][0]['CARRETERA'] === "" || docs[i][0]['CARRETERA'] === undefined || docs[i][0]['CARRETERA'] == null) { } else {
            filter["CARRETERA"] = docs[i][0]['CARRETERA']
          }
          if (docs[i][0]['CLAVE CARRETERA'] === "" || docs[i][0]['CLAVE CARRETERA'] === undefined || docs[i][0]['CLAVE CARRETERA'] == null) { } else {
            filter["CLAVE CARRETERA"] = isNaN(parseFloat(docs[i][0]['CLAVE CARRETERA'])) ? 0 : parseFloat(docs[i][0]['CLAVE CARRETERA'])
          }
          if (docs[i][0]['PUNTO GENERADOR'] === "" || docs[i][0]['PUNTO GENERADOR'] === undefined || docs[i][0]['PUNTO GENERADOR'] == null) { } else {
            filter["PUNTO GENERADOR"] = docs[i][0]['PUNTO GENERADOR']
          }
          if (docs[i][0]['CLAVE_E_DV'] === "" || docs[i][0]['CLAVE_E_DV'] === undefined || docs[i][0]['CLAVE_E_DV'] == null) { } else {
            filter["CLAVE_E_DV"] = isNaN(parseFloat(docs[i][0]['CLAVE_E_DV'])) ? 0 : parseFloat(docs[i][0]['CLAVE_E_DV'])
          }
          if (docs[i][0]['variacion']['lun'] === "" || docs[i][0]['variacion']['lun'] === undefined || docs[i][0]['variacion']['lun'] == null) { } else { variacion['lun'] = docs[i][0]['variacion']['lun'] }
          if (docs[i][0]['variacion']['mar'] === "" || docs[i][0]['variacion']['mar'] === undefined || docs[i][0]['variacion']['mar'] == null) { } else { variacion['mar'] = docs[i][0]['variacion']['mar'] }
          if (docs[i][0]['variacion']['mie'] === "" || docs[i][0]['variacion']['mie'] === undefined || docs[i][0]['variacion']['mie'] == null) { } else { variacion['mie'] = docs[i][0]['variacion']['mie'] }
          if (docs[i][0]['variacion']['jue'] === "" || docs[i][0]['variacion']['jue'] === undefined || docs[i][0]['variacion']['jue'] == null) { } else { variacion['jue'] = docs[i][0]['variacion']['jue'] }
          if (docs[i][0]['variacion']['vie'] === "" || docs[i][0]['variacion']['vie'] === undefined || docs[i][0]['variacion']['vie'] == null) { } else { variacion['vie'] = docs[i][0]['variacion']['vie'] }
          if (docs[i][0]['variacion']['sab'] === "" || docs[i][0]['variacion']['sab'] === undefined || docs[i][0]['variacion']['sab'] == null) { } else { variacion['sab'] = docs[i][0]['variacion']['sab'] }
          if (docs[i][0]['variacion']['dom'] === "" || docs[i][0]['variacion']['dom'] === undefined || docs[i][0]['variacion']['dom'] == null) { } else { variacion['dom'] = docs[i][0]['variacion']['dom'] }

          if (Object.keys(variacion).length != 0) {
            set['variacion'] = variacion;
          }
        }

        if (docs[i][0]['TDPA2009'] === "" || docs[i][0]['TDPA2009'] === undefined || docs[i][0]['TDPA2009'] == null) { } else {
          set["TDPA2009"] = docs[i][0]['TDPA2009']
        }
        if (docs[i][0]['TDPA2010'] === "" || docs[i][0]['TDPA2010'] === undefined || docs[i][0]['TDPA2010'] == null) { } else {
          set["TDPA2010"] = docs[i][0]['TDPA2010']
        }
        if (docs[i][0]['TDPA2011'] === "" || docs[i][0]['TDPA2011'] === undefined || docs[i][0]['TDPA2011'] == null) { } else {
          set["TDPA2011"] = docs[i][0]['TDPA2011']
        }
        if (docs[i][0]['TDPA2012'] === "" || docs[i][0]['TDPA2012'] === undefined || docs[i][0]['TDPA2012'] == null) { } else {
          set["TDPA2012"] = docs[i][0]['TDPA2012']
        }
        if (docs[i][0]['TDPA2013'] === "" || docs[i][0]['TDPA2013'] === undefined || docs[i][0]['TDPA2013'] == null) { } else {
          set["TDPA2013"] = docs[i][0]['TDPA2013']
        }
        if (docs[i][0]['TDPA2014'] === "" || docs[i][0]['TDPA2014'] === undefined || docs[i][0]['TDPA2014'] == null) { } else {
          set["TDPA2014"] = docs[i][0]['TDPA2014']
        }
        if (docs[i][0]['TDPA2015'] === "" || docs[i][0]['TDPA2015'] === undefined || docs[i][0]['TDPA2015'] == null) { } else {
          set["TDPA2015"] = docs[i][0]['TDPA2015']
        }
        if (docs[i][0]['TDPA2016'] === "" || docs[i][0]['TDPA2016'] === undefined || docs[i][0]['TDPA2016'] == null) { } else {
          set["TDPA2016"] = docs[i][0]['TDPA2016']
        }
        if (docs[i][0]['TDPA2017'] === "" || docs[i][0]['TDPA2017'] === undefined || docs[i][0]['TDPA2017'] == null) { } else {
          set["TDPA2017"] = docs[i][0]['TDPA2017']
        }
        if (docs[i][0]['TDPA2018'] === "" || docs[i][0]['TDPA2018'] === undefined || docs[i][0]['TDPA2018'] == null) { } else {
          set["TDPA2018"] = docs[i][0]['TDPA2018']
        }
        if (docs[i][0]['TDPA2019'] === "" || docs[i][0]['TDPA2019'] === undefined || docs[i][0]['TDPA2019'] == null) { } else {
          set["TDPA2019"] = docs[i][0]['TDPA2019']
        }
        if (docs[i][0]['TDPA2020'] === "" || docs[i][0]['TDPA2020'] === undefined || docs[i][0]['TDPA2020'] == null) { } else {
          set["TDPA2020"] = docs[i][0]['TDPA2020']
        }
        if (docs[i][0]['TDPA2021'] === "" || docs[i][0]['TDPA2021'] === undefined || docs[i][0]['TDPA2021'] == null) { } else {
          set["TDPA2021"] = docs[i][0]['TDPA2021']
        }
        filter.rubro = docs[i][0].rubro;
        var resp = await modelo.update(filter, { $set: set });
        //console.log(resp.nModified == 1 ? "it works" : "not working");
      } catch (error) {
        console.log(i);
        console.log(error);
      }
    }
  }
}


module.exports = APIs;