import {COOLIFY_API_KEY,COOLIFY_API_URL} from '$env/static/private'


/**
 * 
 * @param endpoint
 * 
 * */ 
async function getData(endpoint:string){
    const response= await fetch(COOLIFY_API_URL+endpoint, {
        headers: {
            'Authorization': `Bearer ${COOLIFY_API_KEY}`
        }
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data
}


export async function load({ fetch }) {
    const applications = await getData("/applications")
    const services = await getData("/services")
    return {
        applications,
        services
    }
}