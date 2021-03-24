import React, { Fragment } from 'react';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import ReactExport from 'react-export-excel'; //LIBRERIA EXCEL
import { withRouter } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
const ExcelFile = ReactExport.ExcelFile; //ARCHIVO DE EXCEL
const ExcelSheet = ReactExport.ExcelSheet; //HOJA DE EXCEL
const ExcelColumn = ReactExport.ExcelColumn; //COLUMNA DE EXCEL

function ExportarExcelMaestros({ maestros }) {

	const data = maestros.map((data) => {
		const instructor = {
            name: '',
            email: '',
            phone: '',
            scholarship: '',
        };

		instructor.name = data.name;
        instructor.email = data.email;
		instructor.phone = data.phone;
		/* instructor.courses = data.code ? `Cupon - ${data.codeKey}` : data.freeCourse ? 'Gratis' : 'Comprado' ; */
		return instructor;
	});

	return (
		<Fragment>
            <Grid>
                <Grid item>
                <ExcelFile
					element={
						<Button size="large" color="primary" variant="contained" startIcon={<DescriptionOutlinedIcon />}>
							Exportar
						</Button>
					}
					filename={`instructores de UNILINE`}
				>
					<ExcelSheet data={data} name="Datos de los instructores">
						<ExcelColumn label="Nombre" value="name" />
						<ExcelColumn label="Email" value="email" />
						<ExcelColumn label="Telefono" value="phone" />
						<ExcelColumn label="Cursos impartidos" value="type_access" />
					</ExcelSheet>
				</ExcelFile>
                </Grid>
            </Grid>
		</Fragment>
	);
}

export default withRouter(ExportarExcelMaestros);
