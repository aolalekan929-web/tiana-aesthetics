import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Banknote, BadgeCheck, Check, ChevronDown, Clock3, Flower2, Heart, ImagePlus, Leaf, LockKeyhole, LogOut, Mail, MapPin, Menu, MessageCircle, Minus, Music2, PackageCheck, Pencil, Plus, Search, Send, ShieldCheck, ShoppingBag, Sparkles, Star, Trash2, Truck, Video, X } from 'lucide-react';
import { loadMediaBlob, removeMediaFiles, saveMediaFiles } from '../mediaStore.js';

const h = React.createElement;
const WA_NUMBER = '2348157040998';
const OWNER_PASSWORD = '2010';
const TAGLINE = 'Girly essentials & decor for a cozy and cozy space. Aesthetic items to upgrade your style, space & vibe.';
const OPAY_ACCOUNT = { bank: 'Opay', name: 'Tiana Aesthetics', number: '8157040998' };
const SAMPLE_CLIP = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const waLink = message => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
const formatNaira = amount => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(amount) || 0);
const safeRead = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const normalizeProduct = product => ({ ...product, category: product.category === 'Cozy Room Decor' ? 'Cozy Decor' : product.category === 'Style & Accessories' ? 'Style' : product.category || 'Girly Essentials', stock: product.stock === 'soldout' ? 'soldout' : 'in' });
const tikTokEmbed = url => { const match = String(url || '').match(/tiktok\.com\/(?:@[^/]+\/)?video\/(\d+)/i); return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : ''; };
const productMedia = product => Array.isArray(product?.media) && product.media.length ? product.media : [product?.image && { src: product.image, kind: 'image' }, product?.altImage && product.altImage !== product.image && { src: product.altImage, kind: 'image' }, product?.videoUrl && { src: product.videoUrl, kind: 'video' }].filter(Boolean);

const STARTER_PRODUCTS = [
  { id:'cloud-cushion', name:'Marshmallow Cloud Cushion', category:'Cozy Room Decor', price:18500, badge:'Soft girl fave', image:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=950&q=85', description:'A dreamy finishing touch for your bed, sofa, or reading nook.' },
  { id:'fairy-lights', name:'Golden Hour Fairy Lights', category:'Cozy Room Decor', price:12800, badge:'Room glow-up', image:'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=950&q=85', description:'Warm little lights for slow evenings and cozy corners.' },
  { id:'vanity-edit', name:'Blush Vanity Edit', category:'Girly Essentials', price:14500, badge:'Cute & useful', image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=950&q=85', description:'Keep your everyday beauty bits neat, pretty, and easy to reach.' },
  { id:'satin-scrunchies', name:'Satin Bow Scrunchie Set', category:'Girly Essentials', price:6500, badge:'Giftable', image:'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=950&q=85', description:'A soft little set for ponytails, buns, and bad hair days.' },
  { id:'pearl-phone-charm', name:'Coquette Pearl Phone Charm', category:'Style & Accessories', price:7800, badge:'Main character', image:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=950&q=85', description:'Pearls, a bow, and a little extra charm wherever you go.' },
  { id:'everyday-tote', name:'Pretty Little Everyday Tote', category:'Style & Accessories', price:14500, badge:'Everyday edit', image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=950&q=85', description:'Room for your daily essentials, with plenty of cute energy.' },
  { id:'soft-hour-candle', name:'Soft Hour Candle', category:'Cozy Room Decor', price:8900, badge:'Little luxury', image:'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=950&q=85', description:'A warm, gentle glow for your wind-down routine.' },
  { id:'bow-clip', name:'Rosy Bow Claw Clip', category:'Style & Accessories', price:5800, badge:'New', image:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=950&q=85', altImage:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=950&q=85', description:'A sweet finishing touch for your favorite easy hairstyle.' }
];
const STARTER_PRODUCT_IDS = new Set(STARTER_PRODUCTS.map(product => product.id));
const isDemoProduct = product => STARTER_PRODUCT_IDS.has(product.id) || product.name === 'Owner Preview Demo';
const STARTER_CLIPS = [
  { id:'clip-room-reset', productId:'cloud-cushion', title:'A little room reset', label:'Room refresh', poster:STARTER_PRODUCTS[0].image, videoUrl:SAMPLE_CLIP },
  { id:'clip-unbox', productId:'vanity-edit', title:'Unbox something lovely', label:'Unboxing moment', poster:STARTER_PRODUCTS[2].image, videoUrl:SAMPLE_CLIP },
  { id:'clip-soft-details', productId:'satin-scrunchies', title:'Soft details in motion', label:'Girly essentials', poster:STARTER_PRODUCTS[3].image, videoUrl:SAMPLE_CLIP }
];
const CATEGORIES = ['All', 'Cozy Decor', 'Girly Essentials', 'Style', 'Video Reviews'];
const FAQS = [
  { q:'How long does delivery take?', a:'Delivery is nationwide. Lagos orders are usually around 1–3 business days, while other states can take about 3–7 business days. These are estimates; we confirm the latest timing and delivery fee with you on WhatsApp.' },
  { q:'How do I pay by transfer?', a:'Choose transfer at checkout, send your order and delivery details to us on WhatsApp, then share your transfer receipt. We verify that the funds have arrived before confirming dispatch.' },
  { q:'What if my order arrives damaged or incorrect?', a:'Please message us on WhatsApp within 24 hours of delivery with your order details and a clear photo or video. We will review it with you and confirm the next step.' },
  { q:'Can I return an item?', a:'If something is not right, chat with us before sending it back. Items should be unused and in their original packaging while we confirm the best resolution together.' }
];

function App(){
  const [products,setProducts]=useState(()=>{const saved=safeRead('tiana-products-v1',STARTER_PRODUCTS);return Array.isArray(saved)?saved.map(normalizeProduct):STARTER_PRODUCTS.map(normalizeProduct)});
  const [clips,setClips]=useState(()=>safeRead('tiana-clips-v1',STARTER_CLIPS));
  const [cart,setCart]=useState(()=>safeRead('tiana-cart-v1',[]));
  const [category,setCategory]=useState('All');
  const [query,setQuery]=useState('');
  const [searchOpen,setSearchOpen]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [cartOpen,setCartOpen]=useState(false);
  const [transferOpen,setTransferOpen]=useState(false);
  const [ownerOpen,setOwnerOpen]=useState(false);
  const [ownerAuthed,setOwnerAuthed]=useState(false);
  const [ownerError,setOwnerError]=useState('');
  const [editingProductId,setEditingProductId]=useState(null);
  const [ownerNote,setOwnerNote]=useState('');
  const [newsletterNote,setNewsletterNote]=useState('');
  const [faqOpen,setFaqOpen]=useState(0);
  const [mediaUrls,setMediaUrls]=useState({});

  useEffect(()=>{localStorage.setItem('tiana-products-v1',JSON.stringify(products))},[products]);
  useEffect(()=>{localStorage.setItem('tiana-clips-v1',JSON.stringify(clips))},[clips]);
  useEffect(()=>{localStorage.setItem('tiana-cart-v1',JSON.stringify(cart))},[cart]);
  useEffect(()=>{document.body.style.overflow=(cartOpen||transferOpen||ownerOpen)?'hidden':'';return()=>{document.body.style.overflow=''}},[cartOpen,transferOpen,ownerOpen]);

  const mediaReferences=useMemo(()=>{
    const references=new Set();
    const collect=value=>{if(typeof value==='string'&&value.startsWith('idb:'))references.add(value)};
    products.forEach(product=>productMedia(product).forEach(item=>collect(item.src)));
    clips.forEach(clip=>{collect(clip.videoUrl);collect(clip.poster)});
    cart.forEach(item=>collect(item.image));
    return [...references];
  },[products,clips,cart]);
  const mediaReferenceKey=mediaReferences.join('|');

  useEffect(()=>{
    let active=true;
    const createdUrls=[];
    Promise.all(mediaReferences.map(async reference=>{
      const blob=await loadMediaBlob(reference).catch(()=>null);
      return blob?[reference,URL.createObjectURL(blob)]:null;
    })).then(entries=>{
      const urls=Object.fromEntries(entries.filter(Boolean));
      createdUrls.push(...Object.values(urls));
      if(active)setMediaUrls(urls);
      else createdUrls.forEach(url=>URL.revokeObjectURL(url));
    }).catch(()=>{if(active)setMediaUrls({})});
    return ()=>{active=false;createdUrls.forEach(url=>URL.revokeObjectURL(url))};
  },[mediaReferenceKey]);

  const mediaUrl=reference=>typeof reference==='string'&&reference.startsWith('idb:')?(mediaUrls[reference]||''):reference||'';
  const displayProducts=useMemo(()=>products.map(product=>({...product,image:mediaUrl(product.image),altImage:mediaUrl(product.altImage),videoUrl:mediaUrl(product.videoUrl),media:productMedia(product).map(item=>({...item,src:mediaUrl(item.src)}))})),[products,mediaUrls]);
  const displayClips=useMemo(()=>clips.map(clip=>({...clip,poster:mediaUrl(clip.poster),videoUrl:mediaUrl(clip.videoUrl)})),[clips,mediaUrls]);
  const productById=id=>displayProducts.find(product=>product.id===id)||null;
  const cartCount=cart.reduce((sum,item)=>sum+item.qty,0);
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const visibleProducts=useMemo(()=>displayProducts.filter(product=>product.category===category||category==='All').filter(product=>!query.trim()||`${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())),[displayProducts,category,query]);
  const instantMessage=`Hi Tiana Aesthetics 🎀 I’d love to order:\n${cart.map(item=>`• ${item.name} × ${item.qty} — ${formatNaira(item.price*item.qty)}`).join('\n')}\n\nTotal: ${formatNaira(total)}\n\nDelivery details:\nName: \nPhone: \nFull address: \nCity / town: \nState: \n\nPlease confirm availability, delivery fee, and timing. Thank you! 💗`;
  const openCollection=()=>document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});
  const addToBag=product=>{if(product.stock==='soldout')return;const storedProduct=products.find(item=>item.id===product.id);setCart(current=>{const found=current.find(item=>item.id===product.id);return found?current.map(item=>item.id===product.id?{...item,qty:item.qty+1}:item):[...current,{id:product.id,name:product.name,price:Number(product.price),qty:1,image:storedProduct?.image||product.image}]});setCartOpen(true)};
  const changeQty=(id,delta)=>setCart(current=>current.map(item=>item.id===id?{...item,qty:item.qty+delta}:item).filter(item=>item.qty>0));
  const removeItem=id=>setCart(current=>current.filter(item=>item.id!==id));
  const closeCart=()=>setCartOpen(false);
  const buyProductMessage=product=>`Hi Tiana Aesthetics 🎀 I’m interested in the ${product.name} (${formatNaira(product.price)}). Is it available?`;
  const openOwnerDashboard=()=>{setOwnerOpen(true);setOwnerError('');setOwnerNote('')};
  const closeOwnerDashboard=()=>{setOwnerOpen(false);setOwnerAuthed(false);setOwnerError('');setOwnerNote('');setEditingProductId(null)};
  const loginOwner=event=>{event.preventDefault();const password=String(new FormData(event.currentTarget).get('password')||'');if(password===OWNER_PASSWORD){setOwnerAuthed(true);setOwnerError('')}else setOwnerError('That password didn’t match. Please try again.')};
  const saveProduct=async event=>{
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const existing=products.find(item=>item.id===editingProductId);
    const files=data.getAll('mediaFiles').filter(file=>file instanceof File&&file.size>0);
    if(files.some(file=>!file.type.startsWith('image/')&&!file.type.startsWith('video/'))){setOwnerNote('Choose image or video files from your device.');return}
    setOwnerNote(files.length?'Saving your photos and videos…':'Saving product…');

    try{
      const previousMedia=productMedia(existing);
      const uploadedMedia=files.length?await saveMediaFiles(files):[];
      const replacingKinds=new Set(uploadedMedia.map(item=>item.kind));
      const media=[...previousMedia.filter(item=>!replacingKinds.has(item.kind)),...uploadedMedia];
      const images=media.filter(item=>item.kind==='image');
      const videos=media.filter(item=>item.kind==='video');
      const image=images[0]?.src||existing?.image||'';
      if(!image){setOwnerNote('Choose at least one product image from your device.');return}

      const product=normalizeProduct({
        ...existing,
        id:editingProductId||`tiana-${Date.now()}`,
        name:String(data.get('name')).trim(),
        category:String(data.get('category')),
        price:Number(data.get('price')),
        stock:String(data.get('stock')||'in'),
        image,
        altImage:images[1]?.src||image,
        videoUrl:videos[0]?.src||'',
        media,
        badge:existing?.badge||'Just added',
        description:String(data.get('description')||'Cute new find from Tiana Aesthetics.'),
      });

      setProducts(current=>existing?current.map(item=>item.id===product.id?product:item):[product,...current]);
      setClips(current=>[
        ...current.filter(clip=>clip.productId!==product.id),
        ...videos.map((item,index)=>({id:`clip-${product.id}-${index}`,productId:product.id,title:product.name,label:'Product video',poster:image,videoUrl:item.src})),
      ]);
      form.reset();
      setOwnerNote(existing?`${product.name} has been updated.`:`${product.name} has been added to the shop.`);
      setEditingProductId(null);
    }catch(error){
      setOwnerNote(error instanceof Error?error.message:'The media could not be saved in this browser. Try smaller files or another browser.');
    }
  };
  const deleteProduct=id=>{const product=products.find(item=>item.id===id);const references=productMedia(product).map(item=>item.src);setProducts(current=>current.filter(item=>item.id!==id));setClips(current=>current.filter(clip=>clip.productId!==id));setCart(current=>current.filter(item=>item.id!==id));removeMediaFiles(references).catch(()=>{});if(editingProductId===id)setEditingProductId(null);setOwnerNote(`${product?.name||'Product'} has been removed from the shop.`)};
  const clearAllProducts=()=>{const references=products.flatMap(product=>productMedia(product).map(item=>item.src));setProducts([]);setClips([]);setCart([]);removeMediaFiles(references).catch(()=>{});setEditingProductId(null);setOwnerNote('Your catalog is now empty. Add your own products below.')};
  const clearStarterProducts=()=>{const removedProducts=products.filter(isDemoProduct);const removedIds=new Set(removedProducts.map(product=>product.id));const references=removedProducts.flatMap(product=>productMedia(product).map(item=>item.src));setProducts(current=>current.filter(product=>!isDemoProduct(product)));setClips(current=>current.filter(clip=>!removedIds.has(clip.productId)));setCart(current=>current.filter(item=>!removedIds.has(item.id)));removeMediaFiles(references).catch(()=>{});setOwnerNote(`${removedIds.size} demo products removed. Your own products are unchanged.`)};
  const startEditingProduct=id=>{setEditingProductId(id);setOwnerNote('Product details are ready to edit.')};
  const sendTransferOrder=event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const address=`${data.get('address')}, ${data.get('city')}, ${data.get('state')}`;
    const orderLines=cart.map(item=>`• ${item.name} × ${item.qty} — ${formatNaira(item.price*item.qty)}`).join('\n');
    const message=`Hi Tiana Aesthetics 🎀 I’ve made a bank transfer for my order.\n\n${orderLines}\n\nTotal: ${formatNaira(total)}\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nDelivery address: ${address}\n\nPlease confirm my payment and delivery. Thank you!`;
    window.location.href=waLink(message);
  };

  const pageChildren=[
    h(Announcement,{key:'announce'}),
    h(Header,{key:'header',cartCount,searchOpen,setSearchOpen,query,setQuery,mobileOpen,setMobileOpen,onOpenBag:()=>setCartOpen(true),onOpenOwner:openOwnerDashboard}),
    h('main',{key:'main'},
      h(Hero,{onShop:openCollection}),
      h(ValueBar),
      h(ProductSection,{products:displayProducts,clips:displayClips,visibleProducts,category,setCategory,query,setQuery,onOpenOwner:openOwnerDashboard,onAdd:addToBag,onOrder:buyProductMessage}),
      h(BrandStory),
      h(VideoCorner,{clips:displayClips,productById,onAdd:addToBag}),
      h(OrderSteps),
      h(FAQSection,{faqOpen,setFaqOpen})
    ),
    h(Footer,{key:'footer',newsletterNote,setNewsletterNote}),
    h(CartDrawer,{key:'drawer',open:cartOpen,cart,products:displayProducts,cartCount,total,onClose:closeCart,onQty:changeQty,onRemove:removeItem,onCheckout:()=>{setTransferOpen(true);setCartOpen(false)},instantLink:waLink(instantMessage)}),
    h(TransferModal,{key:'transfer',open:transferOpen,total,onClose:()=>setTransferOpen(false),onSubmit:sendTransferOrder}),
    h(OwnerDashboardAdmin,{key:'owner-dashboard',open:ownerOpen,authenticated:ownerAuthed,error:ownerError,note:ownerNote,products:displayProducts,editProduct:displayProducts.find(item=>item.id===editingProductId),onLogin:loginOwner,onClose:closeOwnerDashboard,onLogout:closeOwnerDashboard,onEdit:startEditingProduct,onDelete:deleteProduct,onClearDemo:clearStarterProducts,onClearAll:clearAllProducts,onSubmit:saveProduct,onCancelEdit:()=>{setEditingProductId(null);setOwnerNote('Edit cancelled.')}})
  ];
  return h(React.Fragment,null,...pageChildren);
}

function Announcement(){return h('div',{className:'announcement'},h('div',{className:'ticker-track'},h('span',null,'🎀 Nationwide Delivery across Nigeria  |  Upgrade Your Space & Vibe ✨'),h('span',{'aria-hidden':true},'🎀 Nationwide Delivery across Nigeria  |  Upgrade Your Space & Vibe ✨')));}

function Header({cartCount,searchOpen,setSearchOpen,query,setQuery,mobileOpen,setMobileOpen,onOpenBag,onOpenOwner}){
  const links=[['Shop','#shop'],['Aesthetics Showcase','#aesthetic-corner'],['How to Order','#how-to-order'],['Contact','#contact']];
  return h('header',{className:'site-header'},
    h('div',{className:'header-inner'},
      h('a',{className:'brand',href:'#home','aria-label':'Tiana Aesthetics home'},h('span',{className:'brand-bow','aria-hidden':true},'🎀'),h('span',{className:'brand-name-wrap'},h('span',{className:'brand-name'},'Tiana Aesthetics'),h('span',{className:'brand-caption'},'CUTE THINGS, COZY FEELINGS'))),
      h('nav',{className:'desktop-nav','aria-label':'Main navigation'},links.map(([label,href])=>h('a',{href,key:href},label))),
      h('div',{className:'header-actions'},
        h('a',{className:'social-mini','aria-label':'TikTok @TianaAesthetics',href:'https://www.tiktok.com/@TianaAesthetics',target:'_blank',rel:'noreferrer'},h(Music2)),
        h('button',{className:'icon-button mobile-menu','aria-label':mobileOpen?'Close menu':'Open menu',onClick:()=>setMobileOpen(value=>!value)},h(mobileOpen?X:Menu)),
        h('button',{className:'icon-button search-toggle','aria-label':searchOpen?'Close search':'Search',onClick:()=>setSearchOpen(value=>!value)},h(Search)),
        h('button',{className:'owner-shortcut','aria-label':'Open owner dashboard',title:'Owner dashboard',onClick:onOpenOwner},h(LockKeyhole),h('span',null,'Owner')),
        h('button',{className:'bag-button','aria-label':`Shopping bag, ${cartCount} items`,onClick:onOpenBag},h(ShoppingBag),h('span',null,'Bag'),h('span',{className:'bag-count'},cartCount))
      )
    ),
    searchOpen&&h('div',{className:'search-panel'},h(Search),h('input',{type:'search',value:query,onChange:event=>{setQuery(event.target.value);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})},placeholder:'Find your next cute thing…','aria-label':'Search products'}),h('button',{className:'close-search','aria-label':'Close search',onClick:()=>{setSearchOpen(false);setQuery('')}},h(X))),
    h('nav',{className:`mobile-nav ${mobileOpen?'open':''}`,'aria-label':'Mobile navigation'},links.map(([label,href])=>h('a',{href,key:href,onClick:()=>setMobileOpen(false)},label)))
  );
}

function Hero({onShop}){return h('section',{className:'hero',id:'home'},
  h('div',{className:'hero-copy'},h('span',{className:'eyebrow-pill'},h(Sparkles),'Your happy place starts here'),h('h1',null,'Upgrade Your Style, ',h('em',null,'Space'),h('br'), '& Vibe ',h('span',{className:'title-bow'},'🎀')),h('p',null,TAGLINE),h('div',{className:'hero-actions'},h('button',{className:'button-primary',onClick:onShop},'Shop The Vibe',h(ArrowRight)),h('a',{className:'button-secondary',href:waLink('Hi Tiana Aesthetics 🎀 I’d love to ask a question about your collection.'),target:'_blank',rel:'noreferrer'},h(MessageCircle),'Chat on WhatsApp')),h('div',{className:'hero-trust'},h('span',null,h(Heart),' Made for your soft era'),h('span',null,h(Star),' Cute finds, happy prices'))),
  h('div',{className:'hero-art'},h('div',{className:'hero-spark hero-spark-one'},'✦'),h('div',{className:'hero-spark hero-spark-two'},'✧'),h('div',{className:'hero-orbit orbit-one'}),h('div',{className:'hero-orbit orbit-two'}),h('img',{className:'hero-image',src:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1300&q=90',alt:'A cozy blush-toned room with soft textures',fetchPriority:'high',onError:imageFallback}),h('div',{className:'floating-note'},h('span',null,'✨'),h('div',null,h('strong',null,'Cozy looks good on you'),h('small',null,'little things, lovely feelings'))),h('div',{className:'floating-bow'},'🎀'))
);}

function ValueBar(){return h('section',{className:'value-bar','aria-label':'Tiana Aesthetics promises'},h('div',{className:'value-inner'},[[BadgeCheck,'Affordable'],[Sparkles,'Stylish'],[Truck,'Nationwide Delivery · Nigeria']].map(([Icon,label])=>h('div',{className:'value-item',key:label},h('span',{className:'value-icon'},h(Icon)),h('span',null,label)))));}

function ProductSection({products,clips,visibleProducts,category,setCategory,query,setQuery,onOpenOwner,onAdd,onOrder}){
  const isVideoCategory=category==='Video Reviews';
  return h('section',{className:'section shop-section',id:'shop'},
    h(SectionHeading,{eyebrow:'A little something lovely',title:'Shop the vibe',copy:'Cute, cozy, and picked with love for your everyday.'}),
    h('div',{className:'shop-tools'},h('div',{className:'category-tabs','role':'tablist','aria-label':'Shop categories'},CATEGORIES.map(item=>h('button',{key:item,className:`category-tab ${category===item?'active':''}`,role:'tab','aria-selected':category===item,onClick:()=>setCategory(item)},item))),h('button',{className:'owner-toggle',onClick:onOpenOwner},h(LockKeyhole),' Owner Dashboard')),
    h('div',{className:'catalog-toolbar'},h('span',null,isVideoCategory?`${clips.length} little videos`:`${visibleProducts.length} cute finds`),h('span',null,'Prices in Nigerian Naira ₦')),
    isVideoCategory?h('div',{className:'clip-grid catalog-videos'},clips.map(clip=>h(ClipCard,{key:clip.id,clip,product:products.find(item=>item.id===clip.productId),onAdd}))):h('div',{className:'product-grid'},visibleProducts.length?visibleProducts.map(product=>h(ProductCard,{key:product.id,product,onAdd,onOrder})):h('div',{className:'empty-products'},h('span',null,'🎀'),h('p',null,query?`No cute finds for “${query}” yet.`:'Nothing in this category just yet.'),h('button',{className:'text-button',onClick:()=>{setQuery('');setCategory('All')}},'See everything',h(ArrowRight))))
  );
}

function ProductCard({product,onAdd,onOrder}){
  const [loved,setLoved]=useState(false);
  const message=onOrder(product);
  const soldOut=product.stock==='soldout';
  return h('article',{className:'product-card'},
    h('div',{className:'product-media'},product.videoUrl?h(MediaPreview,{className:'product-image product-video',url:product.videoUrl,poster:product.image,title:product.name}):h('div',{className:'image-stack'},h('img',{className:'product-image primary-image',src:product.image,alt:product.name,loading:'lazy',onError:imageFallback}),product.altImage&&h('img',{className:'product-image secondary-image',src:product.altImage,alt:'',loading:'lazy',onError:imageFallback})),h('span',{className:`product-badge ${soldOut?'sold-out':''}`},h(Sparkles),soldOut?'Sold out':product.badge||'Cute find'),h('button',{className:`quick-heart ${loved?'loved':''}`,'aria-label':loved?`Remove ${product.name} from your cute list`:`Add ${product.name} to your cute list`,'aria-pressed':loved,onClick:()=>setLoved(value=>!value)},h(Heart,{fill:loved?'currentColor':'none'})),h('span',{className:'media-bow','aria-hidden':true},'🎀')),
    h('div',{className:'product-info'},h('div',{className:'product-meta'},h('span',{className:'product-category'},product.category),h('span',{className:'product-rating'},h(Star),' 5.0')),h('h3',null,product.name),h('p',null,product.description),h('div',{className:'product-buy-row'},h('strong',{className:'product-price'},formatNaira(product.price)),h('button',{className:'add-button',disabled:soldOut,onClick:()=>onAdd(product)},soldOut?'Sold Out':h(React.Fragment,null,h(Plus),' Add to Bag'))),h('a',{className:'product-whatsapp',href:waLink(message),target:'_blank',rel:'noreferrer'},h(MessageCircle),soldOut?' Ask about restock':' Order via WhatsApp',h(ArrowUpRight)))
  );
}

function OwnerDashboardAdmin({open,authenticated,error,note,products,editProduct,onLogin,onClose,onLogout,onEdit,onDelete,onClearDemo,onClearAll,onSubmit,onCancelEdit}) {
  const [confirmClear,setConfirmClear]=useState(false);
  const [confirmAll,setConfirmAll]=useState(false);
  const [confirmDeleteId,setConfirmDeleteId]=useState('');
  if(!open)return null;
  const starterCount=products.filter(isDemoProduct).length;
  const stockCount=products.filter(product=>product.stock!=='soldout').length;
  const soldCount=products.length-stockCount;
  const closeOnBackdrop=event=>{if(event.target===event.currentTarget)onClose()};

  if(!authenticated)return (
    <div className="modal-backdrop owner-backdrop" onMouseDown={closeOnBackdrop}>
      <section className="owner-login owner-panel" role="dialog" aria-modal="true" aria-label="Owner dashboard sign in">
        <button className="close-button owner-login-close" aria-label="Close owner sign in" onClick={onClose}><X /></button>
        <span className="owner-icon"><LockKeyhole /></span>
        <span className="eyebrow-small">PRIVATE SHOP TOOLS</span>
        <h2>Owner sign in</h2>
        <p>Enter your owner password to manage the Tiana Aesthetics storefront.</p>
        <form className="owner-login-form" onSubmit={onLogin}>
          <OwnerField name="password" label="Owner password" type="password" required autoComplete="current-password" />
          {error&&<p className="owner-error" aria-live="polite">{error}</p>}
          <button className="button-primary" type="submit"><LockKeyhole /> Unlock dashboard</button>
        </form>
      </section>
    </div>
  );

  return (
    <div className="modal-backdrop owner-backdrop" onMouseDown={closeOnBackdrop}>
      <section className="owner-dashboard owner-panel" role="dialog" aria-modal="true" aria-label="Owner dashboard">
        <header className="dashboard-header">
          <div><span className="eyebrow-small">TIANA AESTHETICS · ADMIN</span><h2>Owner dashboard</h2><p>Products you manage here appear in this browser’s storefront.</p></div>
          <div className="dashboard-actions"><button className="dashboard-logout" onClick={onLogout}><LogOut /> Sign out</button><button className="close-button" aria-label="Close owner dashboard" onClick={onClose}><X /></button></div>
        </header>
        <div className="dashboard-stats">
          {[[PackageCheck,products.length,'Products'],[BadgeCheck,stockCount,'In stock'],[Clock3,soldCount,'Sold out']].map(([Icon,value,label])=><div className="dashboard-stat" key={label}><Icon /><strong>{value}</strong><span>{label}</span></div>)}
        </div>
        <section className="dashboard-section">
          <div className="dashboard-section-title"><div><span className="eyebrow-small">{editProduct?'EDIT INVENTORY':'INVENTORY EDITOR'}</span><h3>{editProduct?'Update product':'Add a product'}</h3></div></div>
          <form className="owner-form dashboard-form" key={editProduct?.id||'new-product'} onSubmit={onSubmit}>
            <OwnerField name="name" label="Product name" placeholder="e.g. Rosy desk mirror" required defaultValue={editProduct?.name||''} />
            <OwnerField name="price" label="Price · ₦" type="number" placeholder="8500" required min="0" step="1" defaultValue={editProduct?.price??''} />
            <label className="form-field"><span>Category</span><select name="category" defaultValue={editProduct?.category||'Cozy Decor'}>{['Cozy Decor','Girly Essentials','Style'].map(value=><option key={value} value={value}>{value}</option>)}</select></label>
            <label className="form-field"><span>Stock status</span><select name="stock" defaultValue={editProduct?.stock||'in'}><option value="in">In Stock</option><option value="soldout">Sold Out</option></select></label>
            <label className="form-field media-upload-field"><span>Product photos and videos</span><input type="file" name="mediaFiles" accept="image/*,video/*" multiple required={!editProduct} /><small>Choose files from your phone or computer. Selecting new photos or videos replaces that media type.</small></label>
            {editProduct?.media?.length>0&&<div className="existing-media-previews" aria-label="Current product media">{editProduct.media.map((item,index)=>item.kind==='video'?<video key={`${item.src}-${index}`} src={item.src} controls playsInline preload="metadata" aria-label={`Current product video ${index+1}`} />:<img key={`${item.src}-${index}`} src={item.src} alt={`Current product photo ${index+1}`} />)}</div>}
            <OwnerField name="description" label="Short description" placeholder="A little line about your find" defaultValue={editProduct?.description||''} />
            <div className="owner-form-actions"><button className="button-primary owner-submit" type="submit">{editProduct?<Check />:<Plus />}{editProduct?' Save changes':' Add product'}</button>{editProduct&&<button className="dashboard-cancel" type="button" onClick={onCancelEdit}>Cancel edit</button>}</div>
          </form>
          <p className="owner-note" aria-live="polite">{note||'Your product list and uploaded media save in this browser.'}</p>
        </section>
        <section className="dashboard-section inventory-section">
          <div className="dashboard-section-title inventory-title"><div><span className="eyebrow-small">CURRENT CATALOG</span><h3>Store inventory</h3></div><div className="inventory-title-actions"><span className="inventory-count">{products.length} items</span>{starterCount>0&&<button type="button" className="remove-demo-button" onClick={()=>{setConfirmClear(true);setConfirmAll(false)}}>Remove demo items</button>}</div></div>
          {confirmClear&&<div className="dashboard-confirm"><div><strong>Remove {starterCount} demo products?</strong><p>This removes the preloaded sample products and their demo previews. Any products you added will stay.</p></div><button type="button" className="confirm-delete-button" onClick={()=>{onClearDemo();setConfirmClear(false)}}>Remove demo items</button><button type="button" className="dashboard-cancel" onClick={()=>setConfirmClear(false)}>Keep them</button></div>}
          {confirmAll&&<div className="dashboard-confirm danger-confirm"><div><strong>Clear the entire catalog?</strong><p>This removes every product, video, and bag item saved in this browser, including products you added.</p></div><button type="button" className="confirm-delete-button" onClick={()=>{onClearAll();setConfirmAll(false);setConfirmClear(false)}}>Clear all items</button><button type="button" className="dashboard-cancel" onClick={()=>setConfirmAll(false)}>Cancel</button></div>}
          {products.length?<div className="inventory-list">{products.map(product=><article className="inventory-row" key={product.id}><img src={product.image} alt="" onError={imageFallback} /><div className="inventory-product"><h4>{product.name}</h4><span>{product.category}</span>{product.videoUrl&&<small><Video /> Video attached</small>}</div><strong className="inventory-price">{formatNaira(product.price)}</strong><span className={`stock-pill ${product.stock==='soldout'?'sold':''}`}>{product.stock==='soldout'?'Sold Out':'In Stock'}</span><div className="inventory-actions">{confirmDeleteId===product.id?<div className="delete-confirm-actions"><span>Delete this item?</span><button type="button" className="confirm-delete-button" onClick={()=>{onDelete(product.id);setConfirmDeleteId('')}}>Delete</button><button type="button" className="dashboard-cancel" onClick={()=>setConfirmDeleteId('')}>Cancel</button></div>:<><button type="button" className="inventory-edit" aria-label={`Edit ${product.name}`} onClick={()=>onEdit(product.id)}><Pencil /></button><button type="button" className="inventory-delete" aria-label={`Delete ${product.name}`} onClick={()=>setConfirmDeleteId(product.id)}><Trash2 /></button></>}</div></article>)}</div>:<div className="empty-products inventory-empty"><span>🎀</span><p>Your catalog is empty. Add your first product using the form above.</p><button type="button" className="button-primary" onClick={()=>document.querySelector('.dashboard-form input[name="name"]')?.focus()}>Add a product</button></div>}
          {products.length>0&&<button type="button" className="clear-all-link" onClick={()=>{setConfirmAll(true);setConfirmClear(false)}}>Clear all inventory…</button>}
          <p className="dashboard-storage-note">Changes are saved only in this browser. A shared live catalog needs a server or database.</p>
        </section>
      </section>
    </div>
  );
}
function OwnerField({name,label,type='text',placeholder,required,min,maxLength,minLength,step,defaultValue,inputMode,autoComplete}){return h('label',{className:'form-field'},h('span',null,label),h('input',{name,type,placeholder,required,min,minLength,maxLength,step:step||(type==='number'?'1':undefined),defaultValue,inputMode,autoComplete}));}
function MediaPreview({url,poster,title,className}){const embed=tikTokEmbed(url);return embed?h('iframe',{className,src:embed,title:`${title} TikTok video`,loading:'lazy',allow:'encrypted-media; fullscreen; picture-in-picture',allowFullScreen:true,referrerPolicy:'strict-origin-when-cross-origin'}):h('video',{className,controls:true,playsInline:true,preload:'none',poster,'aria-label':title},h('source',{src:url}),'Your browser does not support embedded video.');}

function BrandStory(){return h('section',{className:'story-section',id:'aesthetics-showcase'},h('div',{className:'story-photo-wrap'},h('img',{src:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85',alt:'Warm, cozy decor details in a soft neutral room',loading:'lazy',onError:imageFallback}),h('span',{className:'photo-sticker'},'a cozy little corner ✨')),h('div',{className:'story-copy'},h('span',{className:'eyebrow-pill'},h(Flower2),'The Tiana feeling'),h('h2',null,'Your space, but ',h('em',null,'softer.' )),h('p',null,'Tiana Aesthetics is your happy place for girly essentials and cozy decor. We find the lovely little things that make getting ready sweeter, your room dreamier, and your everyday feel more like you.'),h('div',{className:'story-points'},h('span',null,h(Heart),' Affordable little luxuries'),h('span',null,h(Leaf),' Picked with care'),h('span',null,h(Sparkles),' Made for your vibe')),h('a',{className:'text-button',href:'#how-to-order'},'How to make it yours',h(ArrowRight))));}

function VideoCorner({clips,productById,onAdd}){return h('section',{className:'section video-section',id:'aesthetic-corner'},h(SectionHeading,{eyebrow:'The Aesthetic Corner',title:'Little moments in motion',copy:'Room refreshes, unboxings, and cute finds to inspire your next cozy corner.'}),h('div',{className:'video-note'},h(Video),' Demo clips are ready for your own Tiana videos in Owner Studio.'),h('div',{className:'clip-grid'},clips.map(clip=>h(ClipCard,{key:clip.id,clip,product:productById(clip.productId),onAdd})),clips.length===0&&h('div',{className:'empty-clip'},'Add your first MP4 or WebM from Owner Studio 🎀')));}

function ClipCard({clip,product,onAdd}){return h('article',{className:'clip-card'},h('div',{className:'clip-media'},h(MediaPreview,{url:clip.videoUrl,poster:clip.poster,title:clip.title,className:'clip-video'}),h('span',{className:'clip-label'},h(Sparkles),clip.label),product&&h('button',{className:'shop-clip-button',disabled:product.stock==='soldout',onClick:()=>onAdd(product)},product.stock==='soldout'?'Sold out':'Shop This Item',h(ArrowUpRight))),h('div',{className:'clip-caption'},h('h3',null,clip.title),h('span',null,'🎀 Tiana mood')));}

function OrderSteps(){const steps=[[ShoppingBag,'Pick your pretty','Add your cozy and cute finds to the bag.'],[Banknote,'Choose how to pay','Transfer to Opay or ask us anything on WhatsApp.'],[MessageCircle,'Confirm & get cozy','Share delivery details and we’ll confirm your order together.']];return h('section',{className:'steps-section',id:'how-to-order'},h(SectionHeading,{eyebrow:'Easy as 1, 2, cute',title:'How to order',copy:'A few taps between you and your next favorite thing.'}),h('div',{className:'steps-grid'},steps.map(([Icon,title,copy],index)=>h('article',{className:'step-card',key:title},h('span',{className:'step-number'},`0${index+1}`),h('span',{className:'step-icon'},h(Icon)),h('h3',null,title),h('p',null,copy)))));}

function FAQSection({faqOpen,setFaqOpen}){return h('section',{className:'faq-section'},h('div',{className:'faq-intro'},h('span',{className:'eyebrow-pill'},h(Heart),'Good to know'),h('h2',null,'Little questions, ',h('em',null,'answered.' )),h('p',null,'Need a little more reassurance? We’re one WhatsApp message away.'),h('a',{className:'button-secondary',href:`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Tiana Aesthetics 🎀 I have a question about an order.')}`,target:'_blank',rel:'noreferrer'},h(MessageCircle),' Ask us on WhatsApp')),h('div',{className:'faq-list'},FAQS.map((item,index)=>h('article',{className:`faq-item ${faqOpen===index?'open':''}`,key:item.q},h('button',{className:'faq-question','aria-expanded':faqOpen===index,onClick:()=>setFaqOpen(faqOpen===index?-1:index)},h('span',null,item.q),h(ChevronDown)),faqOpen===index&&h('p',null,item.a)))));}

function Footer({newsletterNote,setNewsletterNote}){
  return (
    <footer className="site-footer" id="contact">
      <div className="social-callout">
        <div className="social-copy"><span className="eyebrow-pill"><Sparkles />Come hang with us</span><h2>Follow our aesthetic journey <em>@TianaAesthetics</em></h2><p>New finds, cozy corners, and all the cute things we can’t keep to ourselves.</p></div>
        <div className="social-links"><a href="https://www.tiktok.com/@TianaAesthetics" target="_blank" rel="noreferrer" className="social-link"><Music2 /> TikTok <ArrowUpRight /></a><a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="social-link"><MessageCircle /> WhatsApp <ArrowUpRight /></a></div>
      </div>
      <div className="newsletter-panel">
        <div><span className="eyebrow-small">A LITTLE LOVE NOTE 💌</span><h2>Secret discounts & cozy inspiration</h2><p>Get cute updates direct to your inbox.</p></div>
        <form className="newsletter-form" onSubmit={event=>{event.preventDefault();setNewsletterNote('Thanks for the love! Your welcome code is TIANA10 💗');event.currentTarget.reset()}}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" /><button type="submit" aria-label="Join the newsletter"><Send /></button></form>
        <div className="newsletter-note" aria-live="polite">{newsletterNote||'A little inspiration, never inbox clutter.'}</div>
      </div>
      <div className="footer-bottom"><a className="footer-brand" href="#home">🎀 Tiana Aesthetics</a><span>Affordable · Stylish · Nationwide Delivery across Nigeria</span><a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer">Chat with us <ArrowUpRight /></a><small>© 2026 Tiana Aesthetics</small></div>
    </footer>
  );
}
function CartDrawer({open,cart,products,cartCount,total,onClose,onQty,onRemove,onCheckout,instantLink}){
  const byId=id=>products.find(product=>product.id===id)||cart.find(item=>item.id===id);
  const rows=cart.length?cart.map(item=>h(CartRow,{key:item.id,item,product:byId(item.id)||item,onQty,onRemove})):h(EmptyBag,{onClose});
  const checkout=cart.length?h(BagCheckout,{total,onCheckout,instantLink}):null;
  const header=h('div',{className:'drawer-header'},h('div',null,h('span',{className:'eyebrow-small'},'YOUR CUTE FINDS'),h('h2',null,'Shopping bag ',h('span',null,`(${cartCount})`))),h('button',{className:'close-button','aria-label':'Close shopping bag',onClick:onClose},h(X)));
  const drawer=h('aside',{className:`cart-drawer ${open?'open':''}`,'aria-label':'Shopping bag'},header,h('div',{className:'drawer-items'},rows),checkout);
  return h(React.Fragment,null,h('div',{className:`drawer-scrim ${open?'open':''}`,onClick:onClose,'aria-hidden':'true'}),drawer);
}
function CartRow({item,product,onQty,onRemove}){return h('div',{className:'drawer-item'},h('img',{src:product.image,alt:product.name,onError:imageFallback}),h('div',{className:'drawer-item-info'},h('h3',null,item.name),h('p',null,formatNaira(item.price)),h('div',{className:'qty-control'},h('button',{onClick:()=>onQty(item.id,-1),'aria-label':`Decrease ${item.name} quantity`},h(Minus)),h('span',null,item.qty),h('button',{onClick:()=>onQty(item.id,1),'aria-label':`Increase ${item.name} quantity`},h(Plus)))),h('button',{className:'remove-item','aria-label':`Remove ${item.name}`,onClick:()=>onRemove(item.id)},h(X)));}
function EmptyBag({onClose}){return h('div',{className:'empty-bag'},h('span',null,'🎀'),h('h3',null,'Your bag is waiting for cute.'),h('p',null,'Find your next cozy favorite and bring it home.'),h('button',{className:'button-primary',onClick:()=>{onClose();document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}},'Shop the vibe',h(ArrowRight)));}
function BagCheckout({total,onCheckout,instantLink}){return h('div',{className:'bag-checkout'},h('div',{className:'subtotal'},h('span',null,'Bag total'),h('strong',null,formatNaira(total))),h('p',{className:'delivery-note'},total>=50000?'Cute! You’re ready for nationwide delivery.':'Nationwide delivery available · fee confirmed on WhatsApp'),h(BankCard),h('button',{className:'button-primary transfer-button',onClick:onCheckout},h(Banknote),' Confirm Bank Transfer'),h('a',{className:'button-whatsapp',href:instantLink,target:'_blank',rel:'noreferrer'},h(MessageCircle),' Send Order to WhatsApp'),h('p',{className:'bag-disclaimer'},h(ShieldCheck),' Payment is confirmed with Tiana on WhatsApp.'));}

function BankCard(){return h('div',{className:'bank-card'},h('div',{className:'bank-card-heading'},h('span',{className:'bank-icon'},h(Banknote)),h('div',null,h('strong',null,'Bank transfer'),h('small',null,'Pay to confirm your order'))),h('div',{className:'bank-line'},h('span',null,'Bank'),h('strong',null,OPAY_ACCOUNT.bank)),h('div',{className:'bank-line'},h('span',null,'Account name'),h('strong',null,OPAY_ACCOUNT.name)),h('div',{className:'bank-line account-line'},h('span',null,'Account number'),h('strong',null,OPAY_ACCOUNT.number)),h('p',null,'Transfer your order total, then confirm with us on WhatsApp.'));}

function TransferModal({open,total,onClose,onSubmit}){if(!open)return null;return h('div',{className:'modal-backdrop',onMouseDown:event=>{if(event.target===event.currentTarget)onClose()}},h('section',{className:'transfer-modal','aria-label':'Transfer and delivery details','role':'dialog','aria-modal':'true'},h('div',{className:'modal-top'},h('div',null,h('span',{className:'eyebrow-small'},'ONE LAST LITTLE STEP'),h('h2',null,'Transfer & confirm')),h('button',{className:'close-button','aria-label':'Close transfer details',onClick:onClose},h(X))),h('p',{className:'modal-intro'},'Make your transfer, then share your order and delivery details with Tiana on WhatsApp.'),h(BankCard),h('form',{className:'delivery-form',onSubmit},h(OwnerField,{name:'name',label:'Your full name',placeholder:'Full name',required:true}),h(OwnerField,{name:'phone',label:'Phone number',type:'tel',placeholder:'080…',required:true}),h(OwnerField,{name:'address',label:'Delivery address',placeholder:'Street and house number',required:true}),h(OwnerField,{name:'city',label:'City / town',placeholder:'e.g. Ikeja',required:true}),h(OwnerField,{name:'state',label:'State',placeholder:'e.g. Lagos',required:true}),h('button',{className:'button-primary transfer-button',type:'submit'},h(MessageCircle),' Pay ',formatNaira(total),' & confirm on WhatsApp',h(ArrowRight))),h('p',{className:'modal-safe-note'},h(ShieldCheck),' Your details are added to your WhatsApp message only.')));}

function SectionHeading({eyebrow,title,copy}){return h('div',{className:'section-heading'},h('span',{className:'eyebrow-pill'},h(Sparkles),eyebrow),h('h2',null,title),h('p',null,copy));}
function imageFallback(event){event.currentTarget.classList.add('image-failed');event.currentTarget.alt='';}

export default App;
