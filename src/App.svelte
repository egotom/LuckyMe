<script>
import { onMount } from 'svelte';
import Solt from './component/solt.svelte';
let s=[], luckMe=[];
let lb="B";
let soltMax=4;
let luckMax=3;
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
function AddLuck(lkm){
	//console.log(lkm);
	let me=lb+'-';
	for(let i in lkm){
		me+=lkm[i];
	}
	luckMe.push(me);
	luckMe=luckMe;
	//console.log(me);
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
				<li><a href="">{lm}</a> <span class="btn" ><img src="close.jpeg" /></span> </li>
			{/each}
		</ul>
		<div class="open">
			<a href="https://github.com/egotom/LuckyMe" target="_blank">开放源代码: github.com/egotom/LuckyMe</a>
		</div>
		
	</div>
	<div class="bod">
		{#each s as lk}
			<Solt lk={lk} lb={lb} addOne={AddLuck}/> 
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
	.luckMe li a:hover{
		text-decoration: underline;
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
	.btn{line-height: 30px;}
	.btn img{
		float: right;
		width: 20px;
		height: 20px;
		margin: 37px 10px 15px 0;
	}
</style>