export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">How DonateConnect Works</h1>
      
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="flex gap-6 items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl font-bold">1</div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Create an Account</h3>
            <p className="text-muted-foreground">Sign up as a Donor to give items, or as an NGO to receive and distribute them.</p>
          </div>
        </div>
        
        <div className="flex gap-6 items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl font-bold">2</div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">List Your Items</h3>
            <p className="text-muted-foreground">Add details about the clothes, electronics, or furniture you want to donate and schedule a convenient pickup time.</p>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl font-bold">3</div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">NGO Acceptance & Pickup</h3>
            <p className="text-muted-foreground">Verified NGOs in your area review your donation and accept it. They will arrange for the items to be picked up from your location.</p>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl font-bold">4</div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Distribution to Beneficiaries</h3>
            <p className="text-muted-foreground">The items are distributed to people in need, and you can track the entire journey on your dashboard!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
