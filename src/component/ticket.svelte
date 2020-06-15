<script>
	export let tick={"dpt":'',"name":'',"no":'',"desc":'',"ts":'',"green":true}, addOne=null, cpt="";
</script>
<div class="tkt" class:gr={tick.green}  on:click={()=>addOne(tick)}>
	<div class="hd">
		<div class="to">{tick.dpt}-{tick.name}</div>
		<div class="no">序列号：{cpt}-{tick.no}</div>
	</div>
	<div class="why">{tick.desc}</div>
	<div class="hd">
		<div></div>
		<div class="ts">{tick.ts}</div>
	</div>
</div>


<style>
	.tkt{background-color:#cc0066;font-size: 20px;font-weight:bold;color:white;margin:10px;padding: 10px;}
	.gr{background-color:#009933;font-size: 20px;font-weight:bold;color:white;margin:10px;padding: 10px;}
	.tkt:hover{background-color: #cc0033;cursor:pointer;}
	.gr:hover{background-color: #009900;cursor:pointer;}
	.hd{display: grid;grid-template-columns: 5fr 2fr;}
	.why{text-indent: 2em;line-height: 200%;}
</style>