import { computed } from "vue";
import { useRoute } from "vue-router";

export function useNavbar(){

const route = useRoute();




const menuItems = computed(() => {

    switch(route.meta.role){

        case 'ADMIN':
            return [
                {title: "home",value:"HomeAdmin",icon:"mdi-home"}
            ];
        default:
         return [
                    { title: "Home", value: "home", icon: "mdi-home" },
                ]

    }

});



return{ menuItems}


}