//layout
import LayoutMaestro from '../components/Layout_Maestro/layout_maestro';
import LayoutContenidoCurso from '../components/Layout_Maestro/layout_contenido';
import LayoutUsers from '../components/Layout_User/layout_usuario';
import LayoutDashboardUser from '../components/Layout_User/layout_dashboar';
import RecuperarPassword from '../components/Layout_User/layout_recovery';
import PagarCurso from '../components/Layout_User/layout_pago';
/* import LayoutPagoMovil from '../components/Layout_User/layout_pago_movil'; */

//Admin pages
import DashboardMaestro from '../pages/maestro/Dashboard_maestro/dashboard';
import SubirCursoMaestro from '../pages/maestro/Subir_curso/crear_curso';
import EstadisticasMaestro from '../pages/maestro/Estadisticas/estadisticas';
import VistaRegistroInstructores from '../pages/maestro/Registro_instructores/vista_registro';

//dashboard registro curso pages
import RegistroInformacionCurso from '../pages/maestro/Subir_curso/Dasboard_curso/Info_general/informacion_curso';
import QueAprenderaEstudiante from '../pages/maestro/Subir_curso/Dasboard_curso/Info_general/Learnings/vista_learnings';
import RegistroContenido from '../pages/maestro/Subir_curso/Dasboard_curso/Contenido_curso/contenido';
import PrecioCurso from '../pages/maestro/Subir_curso/Dasboard_curso/Publicacion_curso/precio';
import TareasEstudiantes from '../pages/maestro/Subir_curso/Tareas/tareas';
import EstudiantesCurso from '../pages/maestro/Subir_curso/Estudiantes/estudiantes';

//Users pages
import Home from '../pages/users/Home/home';
import ResultadoBusqueda from '../pages/users/Busqueda/resultados_busqueda';
import Carrito from '../pages/users/Carrito/carrito';
import MisCursos from '../pages/users/Cursos_usuario/mis_cursos';
import GenerarCertificado from '../pages/users/Dashboard_Usuario/certificado';
import PerfilUsuario from '../pages/users/Perfil_usuario/perfil';
import Politicas from '../pages/users/Politicas/politicas';
import ImagenCorporativa from '../pages/users/Imagen_corporativa/imagen_corporativa';
import LoginUsuario from '../pages/users/Login/login';
import RegistroUsuario from '../pages/users/Registro/registro';
import VistaCurso from '../pages/users/Vista_curso/vista_curso';
import PagoSuccess from '../pages/users/Compra_curso/success_page';
import PagoFailed from '../pages/users/Compra_curso/failed_page';

//other
import Error404 from '../pages/error404';

const routes = [
	{
		path: '/instructor/nuevo_curso',
		component: SubirCursoMaestro,
		exact: true
	},
	{
		path: '/dashboard/:url',
		component: LayoutDashboardUser,
		exact: true
	},
	{
		path: '/certificado/:url',
		component: GenerarCertificado,
		exact: true
	},
	{
		path: '/compra',
		component: PagarCurso,
		exact: true
	},
/* 	{
		path: '/compra_movil/:amount',
		component: LayoutPagoMovil,
		exact: true
	}, */
	{
		path: '/reset_password/:url',
		component: RecuperarPassword,
		exact: true
	},
	{
		path: '/instructor/contenido_curso/:curso',
		component: LayoutContenidoCurso,
		exact: false,
		routes: [
			{
				path: '/instructor/contenido_curso/:curso/general',
				component: RegistroInformacionCurso,
				exact: true,
			},
			{
				path: '/instructor/contenido_curso/:curso/learn',
				component: QueAprenderaEstudiante,
				exact: true,
			},
			{
				path: '/instructor/contenido_curso/:curso/contenido',
				component: RegistroContenido,
				exact: true,
			},
			{
				path: '/instructor/contenido_curso/:curso/precio',
				component: PrecioCurso,
				exact: true,
			},
			{
				path: '/instructor/contenido_curso/:curso/tareas',
				component: TareasEstudiantes,
				exact: true,
			},
			{
				path: '/instructor/contenido_curso/:curso/estudiantes',
				component: EstudiantesCurso,
				exact: true,
			},
			{
				component: Error404
			}
		]
	},
	{
		path: '/instructor',
		component: LayoutMaestro,
		exact: false,
		routes: [
			{
				path: '/instructor/cursos',
				component: DashboardMaestro,
				exact: true,
			},
			{
				path: '/instructor/estadisticas',
				component: EstadisticasMaestro,
				exact: true,
			},
			{
				path: '/instructor/registro_instructores',
				component: VistaRegistroInstructores,
				exact: true,
			},
			{
				component: Error404
			}
		]
	},
	{
		path: '/',
		component: LayoutUsers,
		exact: false,
		routes: [
			{
				path: '/',
				component: Home,
				exact: true
			},
			{
				path: '/busqueda/:url',
				component: ResultadoBusqueda,
				exact: true
            },
            {
				path: '/carrito',
				component: Carrito,
				exact: true
            },
            {
				path: '/mis_cursos',
				component: MisCursos,
				exact: true
            },
            {
				path: '/perfil',
				component: PerfilUsuario,
				exact: true
            },
            {
				path: '/politicas',
				component: Politicas,
				exact: true
			},
			{
				path: '/imagen_corporativa',
				component: ImagenCorporativa,
				exact: true
            },
            {
				path: '/login',
				component: LoginUsuario,
				exact: true
			},
			{
				path: '/registro',
				component: RegistroUsuario,
				exact: true
            },
            {
				path: '/curso/:url',
				component: VistaCurso,
				exact: true
			},
			{
				path: '/payment_success/:idPago',
				component: PagoSuccess,
				exact: true
            },
            {
				path: '/payment_failed/:idPago/:message',
				component: PagoFailed,
				exact: true
			},
			{
				component: Error404
			}
		]
	}
	
];

export default routes;
