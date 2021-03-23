import React, { Fragment, useContext } from 'react';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import ReactExport from 'react-export-excel'; //LIBRERIA EXCEL
import { withRouter } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import { CursoContext } from '../../../../context/curso_context';
const ExcelFile = ReactExport.ExcelFile; //ARCHIVO DE EXCEL
const ExcelSheet = ReactExport.ExcelSheet; //HOJA DE EXCEL
const ExcelColumn = ReactExport.ExcelColumn; //COLUMNA DE EXCEL

function ExportarExcel({ estudiantes }) {
    const { datos } = useContext(CursoContext);

	const data = estudiantes.map((data) => {
		const estudiante = {
            name: '',
            email: '',
            phone: '',
            scholarship: '',
        };

		estudiante.name = data.idUser.name;
        estudiante.email = data.idUser.email;
		estudiante.phone = data.idUser.phone;
        estudiante.scholarship = data.idUser.scholarship;

		return estudiante;
	});

    console.log(data);

	return (
		<Fragment>
            <Grid>
                <Grid item>
                <ExcelFile
					element={
						<Button size="large" color="primary" variant="contained" startIcon={<DescriptionOutlinedIcon />}>
							Exportar tabla
						</Button>
					}
					filename={`estudiantes de ${datos.title}`}
				>
					<ExcelSheet data={data} name="Datos de los estudiantes">
						<ExcelColumn label="Nombre" value="name" />
						<ExcelColumn label="Email" value="email" />
						<ExcelColumn label="Telefono" value="phone" />
						<ExcelColumn label="Escolaridad" value="scholarship" />
					</ExcelSheet>
				</ExcelFile>
                </Grid>
            </Grid>
		</Fragment>
	);
}

export default withRouter(ExportarExcel);
