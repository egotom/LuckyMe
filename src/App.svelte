<script>
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import Solt from './component/solt.svelte';
let s=[], luckMe=[], lst, modal=false, me=[];
let lb="B";
let soltMax=5;
let luckMax=5;
let ts=null;
const LM = writable(JSON.parse(localStorage.getItem("luckMe"))|| []);
const unsubscribe= LM.subscribe(value => {
	luckMe = value;
});

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
	let me=lb+'-';
	for(let i in lkm){
		me+=lkm[i];
	}
	luckMe=[me, ...luckMe];
	LM.subscribe(localStorage.setItem("luckMe",JSON.stringify(luckMe)));
}

function DelLuck(lkm){
	luckMe=luckMe.filter((me)=>me!=lkm);
	LM.subscribe(localStorage.setItem("luckMe",JSON.stringify(luckMe)));
}

function Bingo(v){
	let me='';
	for(let i in v){
		me+=v[i];
	}
	let nb=parseInt(me);
	let ok=false;
	for(let i in lst){
		if(nb==lst[i][0]){
			ok=true;
			break;
		}
	}
	let ding=lb+'-'+me;
	for(let j in luckMe){
		if(luckMe[j]==ding)
			return false;
	}
	return ok;
}
function doModal(v){
	modal=!modal;
	if(typeof v=="string"){
		console.log(v.substring(2));
		me=[];
		let nb=parseInt(v.substring(2));
		for(let i in lst){
			if(nb==lst[i][0]){
				me=lst[i];
				break;
			}
		}
	}
}
onMount(async () => {
	const res = await fetch(`http://120.26.118.222:5000/rflyts/4`);
	let lty = await res.json();
	soltMax=lty.sn;
	lb=lty.cpt;
	lst=lty.lst;
	Init();
	//console.log(lst);
});

</script>
<main>
	{#if modal}
	<div class="backdrop">
		<div class="back">
			<div class="modal" on:click={doModal}>
				<div class="info">
					<p class="who">{me[2]} : {me[3]}</p>
					<p class="sel">{lb}-{me[0]}</p>
					<p class="why">因：{me[4]}</p>
					<p class="when">{me[5]}</p>
				</div>
			</div>
		</div>
	</div>
	{/if}
	<div class="dash">
		<div class="opt">
			<span class="label">获奖人数：</span><input type="text" on:keyup={Init} bind:value={luckMax} id="luckMax">
			<br/>
			<button on:click={Start}>开 始</button>
			<button on:click={Pause}>停 止</button>
			<ul class="luckMe">
				{#each luckMe as lm}
					<li><b on:click={()=>doModal(lm)}>{lm}</b> <span class="btn" on:click={()=>DelLuck(lm)}><img alt="close" src="close.jpeg" /></span> </li>
				{/each}
			</ul>
			<div class="open">
				<a href="https://github.com/egotom/LuckyMe" target="_blank">开放源代码: github.com/egotom/LuckyMe</a>
			</div>
			
		</div>
		<div class="bod">
			{#each s as lk}
				{#if Bingo(lk)}
					<Solt lk={lk} lb={lb} addOne={AddLuck} miss={false}/> 
				{:else}
					<Solt lk={lk} lb={lb} miss={true}/> 
				{/if}
			{/each}
		</div>
	</div>	
</main>
<style>
	.dash{
		display: grid;
		grid-template-columns: 1fr 3fr;
	}
	.luckMe{
		list-style: none;
		border: 2px solid red;
		margin-right:21px; 
		margin-bottom: 20px;
	}
	.luckMe li b{
		color: rgb(255,0,0);
		font-size: 65px;
		font-weight: bold;
		text-decoration: none;
	}
	.luckMe li b:hover{
		text-decoration: underline;
		cursor:pointer;
	}
	.label{
		font-size: 20px;
		font-weight: bold;
		color: rgb(0,0,255);
	}
	.open{
		margin-top: 20px;
		height:30px;
    	position: fixed;
    	bottom:10px;
	}
	.btn{line-height: 30px;}
	.btn:hover{cursor:pointer;}
	.btn img{
		float: right;
		width: 20px;
		height: 20px;
		margin: 37px 10px 15px 0;
	}
	.backdrop{
		width: 100%;
		height: 100%;
		position: fixed;
		background: rgb(0,0,0,0.8);
	}
	.back{
		border-radius: 5px;
		width: 952px;
		height: 400px;
		margin:5% auto;
		background-color: white;
	}
	.modal{
		border-radius: 5px;
		width: 952px;
		height: 400px;
		background-image:url("/red.jpg");
		background-size: cover;
		filter:alpha(opacity=60);

	}
	.info p{
		color:#222;
		font-size: 40px;
		font-weight: bold;
	}
	.who{
		margin-left: 30px;
		margin-top: 30px;
		display: inline-block;
		margin-bottom: 0;
	}
	.sel{
		float:right;
		margin-top: 30px;
		margin-right: 30px;
		display: inline-block;
		margin-bottom: 0;
	}
	.why{
		text-indent:2em;
		margin-top: 20px;
	}
	.when{
		float:right;
		margin-top: 30px;
		margin-right: 30px;
		margin-bottom: 30;
	}
</style>