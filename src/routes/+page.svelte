<script lang="ts">
    import { ChevronDown, ChevronUp, Server, Globe } from 'lucide-svelte';
    import { fade } from 'svelte/transition';
    import type {Application} from '$lib/types'

    function splitAtLastOccurrence(str:string, separator:string) {
        if(!str){
          return "#"
        }
        if(str.split(":").length==2){
            return str
        }
        const lastIndex = str.lastIndexOf(separator);
        if (lastIndex === -1) {
            return [str];
        }
        const before = str.substring(0, lastIndex);
        const after = str.substring(lastIndex + separator.length);
        return before;
    }


    function filterData(data:any[]){
        return data.map(application=>{
            return {
                id:application.uuid,
                name:application.name,
                status: application.status.split(":")[0],
                type: application.description,
                link: application.applications ? splitAtLastOccurrence(application.applications[0].fqdn,":") : application.fqdn,
                version: application.config_hash,
                port: application.fqdn ? application.fqdn.split(":")[0] : 80,
                environment: application.environment_id,
                lastDeploy: application.updated_at
            }
        })
    }

    let {data} = $props()
    let applications = $derived(filterData(data.applications))
    let services = $derived(filterData(data.services))  
    let expandedService = $state(null);
  
    function getStatusColor(status:string) {
      switch (status.toLowerCase()) {
        case 'running':
          return 'text-green-500';
        case 'stopped':
          return 'text-red-500';
        case 'pending':
          return 'text-yellow-500';
        default:
          return 'text-gray-500';
      }
    }
  </script>
  
  <div class="container mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold mb-8">Coolify Dashboard</h1>
    
    <!-- Services Section -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Services</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each services as service (service.id)}
          <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-200">
            <div class="p-4 flex flex-row items-center justify-between border-b border-gray-200">
              <a href={service.link} target="_blank">
                <div class="flex items-center space-x-2 font-semibold">
                    <Server class="h-5 w-5" />
                    <span>{service.name}</span>
                </div>
              </a>
              <button
                onclick={() => expandedService = expandedService === service.id ? null : service.id}
                class="p-1 hover:bg-gray-100 rounded"
              >
                {#if expandedService === service.id}
                  <ChevronUp class="h-5 w-5" />
                {:else}
                  <ChevronDown class="h-5 w-5" />
                {/if}
              </button>
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">Status</span>
                <span class="font-medium {getStatusColor(service.status)}">
                  {service.status}
                </span>
              </div>
              {#if expandedService === service.id}
                <div transition:fade class="mt-4 space-y-2 text-sm text-gray-600">
                  <div>Type: {service.type}</div>
                  <div>Version: {service.version}</div>
                  <div>Port: {service.port}</div>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
  
    <!-- Applications Section -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Applications</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each applications as app (app.id)}
          <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <a href={app.link} target="_blank">
                <div class="flex items-center space-x-2 font-semibold">
                    <Globe class="h-5 w-5" />
                    <span>{app.name}</span>
                </div>
              </a>
            </div>
            <div class="p-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Status</span>
                  <span class="font-medium {getStatusColor(app.status)}">
                    {app.status}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Environment</span>
                  <span class="text-sm font-medium">{app.environment}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Last Deploy</span>
                  <span class="text-sm">{new Date(app.lastDeploy).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  </div>