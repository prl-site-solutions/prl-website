// "Request workers" form (every page with #enquiryForm) → PRISM /api/enquiry, which emails info@
// Records the page it was sent from so the team knows which page brought the enquiry.
(function(){
  const form=document.getElementById('enquiryForm')
  if(!form) return
  const status=document.getElementById('enquiryStatus')
  const button=form.querySelector('button[type=submit]')
  const startedAt=Date.now()
  const FALLBACK='Please call 0800 772 3959 or email info@prlsitesolutions.co.uk.'
  form.addEventListener('submit',async e=>{
    e.preventDefault()
    status.className='enquiry-status'
    const firstInvalid=[...form.querySelectorAll('[required]')].find(el=>!el.value.trim()||!el.checkValidity())
    if(firstInvalid){
      status.className='enquiry-status error'
      status.textContent='Please fill in '+form.querySelector(`label[for="${firstInvalid.id}"]`).textContent.toLowerCase()+'.'
      firstInvalid.focus()
      return
    }
    const data=Object.fromEntries(new FormData(form))
    data.startedAt=startedAt
    data.page=location.pathname
    button.disabled=true
    button.textContent='Sending…'
    try{
      const res=await fetch('https://www.prismworkforce.online/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      const body=await res.json().catch(()=>({}))
      if(!res.ok) throw new Error(body.error||FALLBACK)
      window.prlTrack&&prlTrack('Enquiry sent',{page:location.pathname,workers:data.workers||'',location:data.location||''})
      form.innerHTML='<div class="enquiry-done"><h3>Thanks, we\'ve got your enquiry</h3><p>One of the team will call you back, usually the same working day. Need someone sooner? Call 0800 772 3959.</p></div>'
      form.querySelector('h3').setAttribute('tabindex','-1')
      form.querySelector('h3').focus()
    }catch(err){
      window.prlTrack&&prlTrack('Enquiry failed',{reason:String(err.message).slice(0,80)})
      status.className='enquiry-status error'
      status.textContent=err.message&&err.message!=='Failed to fetch'?err.message:'Sorry, that didn\'t send. '+FALLBACK
      button.disabled=false
      button.textContent='Send enquiry'
    }
  })
})()
