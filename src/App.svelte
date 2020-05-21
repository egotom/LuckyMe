<script>
import { onMount } from 'svelte';
import Solt from './component/solt.svelte';
let s=[], luckMe=['A-1258','A-1258'];
let soltMax=6;
let luckMax=1;
let ts=null;

function Init(){
	s=[];
	for(let i=0;i<luckMax ;i++){
		let col=[];
		for(let j=0;j<soltMax;j++){
			col.push(0);
		}
		s.push(col);
	}
}
Init();

function Pause(){
	window.clearTimeout(ts);
	ts=null;
}
function Start(){
	ts=window.setTimeout(Start,20);
	let idx=0;
	let idy=0;
	while(true){
	    let number=Math.round(Math.random()*10);
	    if(number<10){	    	
	    	s[idy][idx]=number;
	    	idx++;
	    	if(idx==soltMax){
	    		idy++;
	    		idx=0;
	    	}
	    }
	    if(idx>soltMax && idy>luckMax) break;
	}
}

onMount(async () => {
	//const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
	//photos = await res.json();
});

</script>
<main>	
	<div class="opt">
		<span class="label">获奖人数：</span><input type="text" on:keyup={Init} bind:value={luckMax} id="luckMax">
		<br/>
		<button on:click={Start}>开 始</button>
		<button on:click={Pause}>停 止</button>
		<ul class="luckMe">
			{#each luckMe as lm}
				<li><a href="">{lm}</a></li>
			{/each}
		</ul>
		<div class="open">
			<a href="https://github.com/egotom/luckMe">开放源代码:github.com/egotom/luckMe</a>
		</div>
		
	</div>
	<div class="bod">
		{#each s as lk}
			<Solt lk={lk} lb={"B"}/>
		{/each}
	</div>
</main>
<style>
	main{
		display: grid;
		grid-template-columns: 1fr 3fr;
	}
	.luckMe{
		list-style: none;
		border: 2px solid red;
		margin-right:25px; 
	}
	.luckMe li a{
		color: rgb(255,0,0);
		font-size: 65px;
		font-weight: bold;
		text-decoration: none;
	}
	.label{
		font-size: 20px;
		font-weight: bold;
		color: rgb(0,0,255);
	}
	.open{
		height:30px;
    	position:absolute;
    	bottom:10px;
	}
</style>