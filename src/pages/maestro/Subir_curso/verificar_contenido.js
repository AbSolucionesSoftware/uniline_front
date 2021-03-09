
export function verificarInformacionCurso(datos) {
	if (
		!datos.title ||
		!datos.subtitle ||
		!datos.description ||
		!datos.language ||
		!datos.level ||
		!datos.category ||
        !datos.subCategory ||
        !datos.keyPromotionalImage ||
		!datos.urlPromotionalImage ||
		!datos.urlCourseVideo ||
		!datos.keyPromotionalImage ||
		!datos.hours ||
		!datos.startMessage ||
		!datos.finalMessage
	) {
		return false;
	} else {
		return true;
	}
}

export function verificarLearningsCurso(datos) {
	if(datos.learnings || datos.requirements || datos.whoStudents){
        if (datos.learnings.length === 0 || datos.requirements.length === 0 || datos.whoStudents.length === 0) {
            return false;
        } else {
            return true;
        }
    }else{
        return false;
    }
}

export function verificarBloquesCurso(blocks) {
    if (!blocks || blocks.length === 0) {
        return false;
    } else {
        const array = []
        blocks.forEach((bloques) => {
            if (!bloques.topics || bloques.topics.length === 0) {
                array.push(true);
            }
        });
        if(array.length !== 0){
            return false
        }else{
            return true
        }
    }
}

export function verificarPrecioCurso(datos) {
    if(!datos.priceCourse){
        return false
    }else{
        if(!datos.priceCourse.price && !datos.priceCourse.free){
            return false
        }else {
            return true
        }
    }
}

