import type { Treatment } from '@/types/content'

type TreatmentContent = Omit<Treatment, 'href' | 'media'> & { imageAlt: string }

// Adapted from the corresponding Alrata treatment pages. See docs/services-content.md.
export const treatmentContent: readonly TreatmentContent[] = [
  {
    slug: 'crowns', name: 'Dental Crowns', category: 'Restore your smile',
    description: 'Custom ceramic restorations to protect a damaged tooth and restore its shape and function.',
    imageAlt: 'Custom ceramic crown and onlay restorations',
    introduction: 'A damaged tooth does not always need to be replaced. At Alrata Art of Dentistry in St. Louis, a custom dental crown can help restore a tooth while keeping its natural foundation.',
    sections: [
      { id: 'understanding-crowns', title: 'A new layer of protection.', paragraphs: ['A crown is a custom-made cap that covers a tooth. Your dentist may recommend one when a tooth is cracked, extensively decayed, weakened by a large filling, or needs protection after root canal treatment.', 'The aim is to restore the tooth’s shape and biting surface with a restoration that fits comfortably alongside your other teeth. An examination helps determine whether a crown or a more conservative repair is appropriate.'] },
      { id: 'cerec', title: 'Same-day crowns with CEREC®.', paragraphs: ['Our practice offers CEREC technology to design and make ceramic crowns in the office. Digital images of your tooth guide the design, and the restoration is milled before your dentist checks its fit, appearance, and bite.', 'Suitable cases can be completed in one visit. Your dentist will explain whether same-day treatment is an option for your tooth or whether your care needs additional appointments.'] },
      { id: 'ongoing-care', title: 'Made to be part of your everyday smile.', paragraphs: ['The crown’s shape and shade are selected with your smile in mind. Once it is fitted, the team will explain how to clean around it and care for the tooth underneath.'], points: ['Keep up with brushing, flossing, and dental checkups.', 'Tell the team if your bite feels uneven or the crown becomes uncomfortable.', 'Discuss a protective night guard if you grind or clench your teeth.'] },
    ], relatedSlugs: ['inlays-and-onlays', 'root-canal-endodontics', 'dental-implants'],
  },
  {
    slug: 'dental-veneers', name: 'Dental Veneers', category: 'Refine your smile',
    description: 'Personalized cosmetic treatment for shape, proportion, and a natural-looking smile.',
    imageAlt: 'Close-up of natural-looking teeth',
    introduction: 'Small changes can make a meaningful difference to your smile. Explore porcelain veneers at our St. Louis practice with a conversation about your goals, your teeth, and the look you want to achieve.',
    sections: [
      { id: 'understanding-veneers', title: 'A considered approach to cosmetic care.', paragraphs: ['Porcelain veneers are thin ceramic shells bonded to the front surfaces of teeth. They can change the appearance of chips, discoloration, small gaps, and uneven tooth shapes.', 'Your dentist will assess your oral health and discuss whether veneers suit your concerns. Whitening, aligners, or restorative treatment may be alternatives depending on the changes you are looking for.'] },
      { id: 'your-treatment', title: 'Designed around your smile.', paragraphs: ['Treatment begins with an examination and a discussion of shape, shade, and proportion. Teeth may need preparation to create space for the veneers, followed by impressions or scans for their custom fit.', 'At a later visit, the dentist checks the veneers and bonds them into place. Tooth preparation can involve removing enamel, so it is important to understand the long-term commitment before choosing treatment.'] },
      { id: 'caring-for-veneers', title: 'Care for the smile underneath.', paragraphs: ['Veneers still need daily brushing, flossing, and regular dental visits. They can chip or crack, so avoid using teeth to open packaging or bite hard objects.', 'If you grind your teeth, discuss protection with your dentist. The team will explain maintenance and what to do if a veneer feels loose or damaged.'] },
    ], relatedSlugs: ['teeth-whitening', 'clear-aligners', 'crowns'],
  },
  {
    slug: 'inlays-and-onlays', name: 'Inlays & Onlays', category: 'Restore your smile',
    description: 'Precisely fitted repairs for teeth that need more support than a filling can provide.',
    imageAlt: 'Illustration of a custom restoration fitted into a back tooth',
    introduction: 'When a tooth needs more than a filling but may not need a full crown, an inlay or onlay offers another option. Our St. Louis team will help you understand which repair fits your tooth.',
    sections: [
      { id: 'inlay-or-onlay', title: 'The right coverage for your tooth.', paragraphs: ['An inlay fits within the grooves between a tooth’s raised biting surfaces, called cusps. An onlay extends over one or more cusps to restore a larger area.', 'Both are custom restorations. Your dentist evaluates the remaining tooth structure, the location of damage, and your bite before recommending the amount of coverage needed.'] },
      { id: 'digital-restorations', title: 'Digital design. Individual fit.', paragraphs: ['Alrata uses CEREC technology to take digital images, design a restoration, and mill it in the office. Suitable inlays and onlays can be made and fitted during the same appointment.', 'The restoration is checked against the tooth and your bite before it is secured. Treatment aims to repair the damaged area while conserving healthy tooth structure where possible.'] },
      { id: 'maintaining-your-repair', title: 'Support that needs everyday care.', paragraphs: ['Inlays and onlays are chosen for their fit, function, and tooth-like appearance. Their lifespan depends on your oral health, bite, and home care rather than a fixed number of years.', 'Brush and clean between teeth, attend checkups, and contact the practice if the restoration feels different when you chew.'] },
    ], relatedSlugs: ['crowns', 'oral-hygiene', 'mouth-guard-night-guard'],
  },
  {
    slug: 'oral-hygiene', name: 'Oral Hygiene', category: 'Protect your smile',
    description: 'Professional cleanings, thoughtful checkups, and practical guidance for healthy teeth and gums.',
    imageAlt: 'Dental floss, toothpaste, and oral hygiene products',
    introduction: 'Good dental care starts with the everyday essentials. Our St. Louis team pairs professional cleaning with an examination and practical advice tailored to your teeth and gums.',
    sections: [
      { id: 'preventive-care', title: 'A fresh start for your oral health.', paragraphs: ['Professional cleanings remove plaque and tartar that can build up around teeth and along the gumline. They support your home-care routine and give the team an opportunity to check for changes in your mouth.', 'An examination can identify concerns such as decay or gum inflammation. If you have gum disease, your dentist may recommend care beyond a routine cleaning.'] },
      { id: 'your-visit', title: 'What happens at your visit.', paragraphs: ['Your appointment is guided by your oral health and the type of cleaning you need. Let the team know about sensitivity, bleeding gums, or anything that has changed since your last visit.'], points: ['An assessment of your teeth and gums.', 'Removal of plaque and tartar, with polishing when appropriate.', 'X-rays when clinically needed.', 'Advice on brushing, cleaning between teeth, and your next visit.'] },
      { id: 'between-visits', title: 'Build a routine that works for you.', paragraphs: ['Your dentist or hygienist will recommend a visit schedule based on your needs. Regular care helps the team follow changes over time and address concerns early.', 'Ask about areas that are difficult to clean, persistent bad breath, or products you are considering. Clear, personalized guidance makes caring for your smile easier between appointments.'] },
    ], relatedSlugs: ['fluoride', 'mouth-guard-night-guard', 'teeth-whitening'],
  },
  {
    slug: 'teeth-whitening', name: 'Teeth Whitening', category: 'Refine your smile',
    description: 'Professional whitening options guided by your dentist and your goals.',
    imageAlt: 'Professional teeth whitening treatment',
    introduction: 'If staining has changed the appearance of your smile, start with professional guidance. Alrata Art of Dentistry in St. Louis can help you explore whitening and set realistic expectations for your teeth.',
    sections: [
      { id: 'understanding-stains', title: 'Understand what is changing your shade.', paragraphs: ['Coffee, tea, tobacco, and other factors can contribute to discoloration. Whitening products work on certain stains, but different types of discoloration do not respond in the same way.', 'A dental examination helps identify the source of the color change and whether whitening is suitable. It also gives you a chance to discuss sensitivity and existing restorations.'] },
      { id: 'whitening-options', title: 'Whitening with a plan.', paragraphs: ['Our practice offers take-home whitening using a tray and whitening gel. The team will explain how to use the recommended product and how your progress will be assessed.', 'Ask your dentist about the options currently available and how they compare with products sold over the counter. Follow the prescribed routine rather than increasing application time or combining products on your own.'] },
      { id: 'comfort-and-results', title: 'Keep comfort in the conversation.', paragraphs: ['Whitening can cause temporary sensitivity. Let your dentist know if you already have sensitive teeth or if discomfort develops during treatment.', 'Results vary with the type of staining and your teeth. If whitening will not address your concern, the dentist can discuss alternatives such as veneers without promising a particular shade or outcome.'] },
    ], relatedSlugs: ['dental-veneers', 'oral-hygiene', 'clear-aligners'],
  },
  {
    slug: 'clear-aligners', name: 'Clear Aligners', category: 'Refine your smile',
    description: 'A discreet path toward straighter teeth with a treatment plan made for you.',
    imageAlt: 'A man holding a transparent dental aligner',
    introduction: 'Explore a removable approach to straightening your teeth. At our St. Louis practice, clear aligner treatment begins with an assessment of your smile, bite, and day-to-day needs.',
    sections: [
      { id: 'how-aligners-work', title: 'Small movements, carefully planned.', paragraphs: ['Clear aligners use a series of custom-made transparent trays to gradually move teeth. They may be an option for certain spacing, crowding, or bite concerns.', 'Not every orthodontic concern can be treated with aligners. Your dentist will assess your teeth and discuss which approach is appropriate before planning treatment.'] },
      { id: 'daily-routine', title: 'A treatment that relies on your routine.', paragraphs: ['Aligners are removable for meals and oral hygiene. That flexibility also means consistent wear is important: follow your dentist’s instructions for daily wear and when to change to the next tray.'], points: ['Remove trays for eating and clean your teeth before replacing them.', 'Keep your trays clean using the instructions provided.', 'Attend progress checks so tooth movement can be monitored.', 'Contact the team if a tray is lost, damaged, or no longer fits.'] },
      { id: 'planning-ahead', title: 'Know what to expect before you begin.', paragraphs: ['The number of trays and length of treatment depend on your starting position and goals. Your dentist will explain the expected plan rather than applying a fixed timeline to every smile.', 'Discuss the follow-up care and retainers needed after treatment to help maintain the result.'] },
    ], relatedSlugs: ['oral-hygiene', 'dental-veneers', 'teeth-whitening'],
  },
  {
    slug: 'oral-surgery-extraction', name: 'Oral Surgery & Extractions', category: 'Care when you need it',
    description: 'Thoughtful surgical care with clear guidance before and after treatment.',
    imageAlt: 'A dentist explaining tooth anatomy with a dental model',
    introduction: 'When a tooth cannot be kept or is causing problems, you deserve a clear explanation of the next step. Our St. Louis team will assess your needs and guide you through extraction planning and aftercare.',
    sections: [
      { id: 'considering-extraction', title: 'An assessment before a decision.', paragraphs: ['An extraction may be recommended for a tooth with extensive damage, severe decay, loss of supporting tissue, or problems related to its position. Some impacted or problematic wisdom teeth also need removal.', 'Pain alone does not tell you whether a tooth must be removed. Your dentist will examine the tooth, review imaging when needed, and explain whether it can be restored or requires extraction.'] },
      { id: 'planning-treatment', title: 'Understand your procedure.', paragraphs: ['The approach depends on the tooth’s location and condition. The team will discuss the procedure, appropriate anesthesia, your medical history, and any preparation needed.', 'If a wisdom tooth or another tooth requires more complex care, your dentist will explain the treatment pathway and whether specialist care is needed. Ask questions about comfort, recovery, and follow-up before your visit.'] },
      { id: 'recovery', title: 'Support beyond the appointment.', paragraphs: ['You will receive instructions specific to your procedure for eating, cleaning, managing discomfort, and protecting the healing area. Follow those instructions and contact the practice if your recovery is not progressing as expected.', 'When a tooth is removed, the team can also discuss whether and when replacement options such as an implant or denture should be considered.'] },
    ], relatedSlugs: ['emergency', 'dental-implants', 'dentures'],
  },
  {
    slug: 'dental-implants', name: 'Dental Implants', category: 'Restore your smile',
    description: 'Explore implant treatment designed to restore function, comfort, and confidence.',
    imageAlt: 'A dentist discussing dental implant treatment with a patient',
    introduction: 'A missing tooth can change how you eat, speak, and feel about your smile. Explore dental implants at Alrata Art of Dentistry in St. Louis with a treatment plan based on your oral health and goals.',
    sections: [
      { id: 'understanding-implants', title: 'A foundation for a replacement tooth.', paragraphs: ['A dental implant is a post placed in the jawbone to support a replacement tooth. For a single missing tooth, a crown is attached to the implant after the necessary healing and restorative steps.', 'Implants can also support other types of tooth replacement. Your dentist can compare the options with you, including alternatives that do not involve implant surgery.'] },
      { id: 'implant-planning', title: 'Careful planning comes first.', paragraphs: ['An examination and imaging help your dentist assess the available bone, gum health, and surrounding teeth. Your medical history and individual needs are part of the decision.', 'Implant treatment is completed in stages, including planning, placement, healing, and the final restoration. The timing varies; the team will explain your proposed sequence and any additional care required before treatment.'] },
      { id: 'living-with-implants', title: 'Restore function. Keep caring.', paragraphs: ['The final restoration is designed with your bite and appearance in mind. Implant treatment aims to provide a stable replacement, but suitability and outcomes differ from person to person.', 'Daily cleaning and regular professional care remain important around implants. Ask the team how to care for your restoration and which changes should prompt a call to the practice.'] },
    ], relatedSlugs: ['crowns', 'implant-support-denture', 'dentures'],
  },
  {
    slug: 'root-canal-endodontics', name: 'Root Canal Treatment', category: 'Care when you need it',
    description: 'Endodontic care focused on relieving discomfort and preserving your natural tooth.',
    imageAlt: 'A dentist using a tooth anatomy model to explain treatment',
    introduction: 'An infected or damaged tooth may still be worth saving. Our St. Louis team can assess your symptoms and explain whether root canal treatment is an appropriate way to care for your natural tooth.',
    sections: [
      { id: 'understanding-endodontics', title: 'Care for the inside of your tooth.', paragraphs: ['Root canal treatment addresses damaged or infected pulp, the soft tissue inside a tooth. The dentist removes affected tissue, cleans the internal space, and fills and seals it.', 'The purpose is to treat the problem inside the tooth while retaining the tooth where possible. Your dentist will assess how much healthy structure remains and discuss the options.'] },
      { id: 'treatment-steps', title: 'A clear explanation at each step.', paragraphs: ['The area is numbed before the dentist makes an opening to reach the pulp. After cleaning and filling the canals, the tooth needs an appropriate restoration to seal and protect it.', 'A crown is often recommended, depending on the tooth and the amount of structure remaining. The number of appointments depends on the complexity of your treatment.'] },
      { id: 'after-treatment', title: 'Protect the tooth you have kept.', paragraphs: ['Some tenderness can occur after treatment. Follow the aftercare advice you receive and contact the practice if pain persists, worsens, or you develop new symptoms.', 'Complete any recommended final restoration and continue routine dental care. If you currently have tooth pain, contact the team for an assessment rather than waiting for symptoms to pass.'] },
    ], relatedSlugs: ['crowns', 'emergency', 'oral-hygiene'],
  },
  {
    slug: 'dentures', name: 'Dentures', category: 'Restore your smile',
    description: 'Personalized partial and complete dentures to replace missing teeth and support daily life.',
    imageAlt: 'A set of removable dentures',
    introduction: 'Replacing missing teeth is a personal decision. At Alrata Art of Dentistry in St. Louis, we help you explore denture options with attention to fit, appearance, and the way you use your smile every day.',
    sections: [
      { id: 'denture-options', title: 'Partial or complete. Always personal.', paragraphs: ['Dentures are removable appliances that replace missing teeth and surrounding tissues. Partial dentures replace some teeth in an arch, while complete dentures replace all the teeth in an arch.', 'Your dentist will review the condition of your remaining teeth and gums, discuss your priorities, and explain which options may meet your needs.'] },
      { id: 'fit-and-function', title: 'Designed for your everyday needs.', paragraphs: ['Tooth loss can affect chewing, speech, and the appearance of your smile. A custom denture is planned around your mouth to help address these changes.', 'The fit and bite need careful attention. Tell the team what is difficult with your current teeth or denture, and discuss the adjustment period, follow-up visits, and what to expect from a new appliance.'] },
      { id: 'denture-care', title: 'Keep your fit under review.', paragraphs: ['Your team will explain cleaning and care for both the denture and your mouth. Regular visits allow the dentist to check the tissues and assess the fit as your mouth changes.', 'If your denture moves, rubs, or makes eating difficult, arrange a review. You can also ask whether implant-supported dentures are an option for additional stability.'] },
    ], relatedSlugs: ['implant-support-denture', 'dental-implants', 'oral-hygiene'],
  },
  {
    slug: 'implant-support-denture', name: 'Implant-Supported Dentures', category: 'Restore your smile',
    description: 'Explore dentures supported by dental implants for a more secure foundation.',
    imageAlt: 'A dental model showing an implant-supported denture framework',
    introduction: 'If you are replacing several teeth or considering alternatives to a conventional denture, our St. Louis team can explain how dental implants may provide additional support.',
    sections: [
      { id: 'additional-support', title: 'A different foundation for your denture.', paragraphs: ['Implant-supported dentures use implants in the jawbone to support replacement teeth. Compared with a conventional denture that rests on the gums, this support can improve stability during everyday activities.', 'Different designs have different care requirements. Your dentist will explain the proposed restoration, including how it is maintained and whether it is removable.'] },
      { id: 'suitability', title: 'Start with the complete picture.', paragraphs: ['Implant care requires an assessment of bone, gums, oral health, and medical history. It involves surgery and a staged treatment process, so it is important to understand both the benefits and the commitments.', 'The team will discuss suitability, expected appointments, healing, maintenance, and costs for your plan. Conventional dentures or other options may also be considered.'] },
      { id: 'maintenance', title: 'Long-term care is part of the plan.', paragraphs: ['Implants and the denture they support need regular cleaning and professional checks. Components and replacement teeth may require adjustment or replacement over time.', 'Ask how to clean around the implants and restoration, what follow-up schedule is recommended, and who to contact if something feels loose or uncomfortable.'] },
    ], relatedSlugs: ['dentures', 'dental-implants', 'oral-hygiene'],
  },
  {
    slug: 'botox', name: 'BOTOX', category: 'Personalized facial care',
    description: 'A consultation to discuss facial aesthetic goals, jaw concerns, and suitable treatment options.',
    imageAlt: 'A clinician preparing a facial aesthetic injection',
    introduction: 'Talk through your facial aesthetic goals or jaw muscle concerns with our St. Louis team. A BOTOX consultation starts with your health history, expectations, and an assessment of the options.',
    sections: [
      { id: 'cosmetic-consultation', title: 'Begin with your goals.', paragraphs: ['The practice offers consultations for cosmetic BOTOX treatment. Discuss the facial lines or other concerns you would like to address so the clinician can explain whether treatment is appropriate.', 'The assessment includes your medical history, medicines, previous treatments, and possible risks. The proposed treatment area and expected effects should be discussed before you decide.'] },
      { id: 'jaw-concerns', title: 'Jaw discomfort deserves an assessment.', paragraphs: ['Jaw pain, muscle tension, and difficulty moving the jaw can have different causes. The first step is to understand the problem and discuss suitable care, including conservative options.', 'Botulinum toxin is not FDA-approved for temporomandibular disorders (TMDs). Evidence for treating TMD symptoms is mixed; any proposed use for this purpose is off-label and needs an individual discussion of risks, alternatives, and uncertain benefits.'] },
      { id: 'informed-treatment', title: 'Make an informed decision.', paragraphs: ['Ask what treatment may achieve, which side effects to watch for, and what follow-up is recommended. Results and duration vary, and repeat treatment is a decision to review with your clinician.', 'The team will provide preparation and aftercare instructions specific to the treatment you choose. A consultation does not commit you to having injections.'] },
    ], relatedSlugs: ['mouth-guard-night-guard', 'dental-veneers', 'teeth-whitening'],
    reference: { label: 'Learn about TMD treatment from the National Institute of Dental and Craniofacial Research', href: 'https://www.nidcr.nih.gov/health-info/tmd' },
  },
  {
    slug: 'fluoride', name: 'Fluoride Treatment', category: 'Protect your smile',
    description: 'Preventive fluoride care to help strengthen enamel as part of your dental routine.',
    imageAlt: 'A healthy smile with a shield illustrating enamel protection',
    introduction: 'Prevention is part of a thoughtful dental plan. At our St. Louis practice, your dentist can help you understand whether professional fluoride treatment belongs in your oral-care routine.',
    sections: [
      { id: 'understanding-fluoride', title: 'Extra support for tooth enamel.', paragraphs: ['Fluoride helps strengthen tooth enamel and make it more resistant to decay. Professional treatment applies fluoride to the tooth surface as part of preventive dental care.', 'Your dentist considers your oral health and risk of cavities before recommending treatment. It complements cleaning and daily care rather than replacing them.'] },
      { id: 'your-appointment', title: 'A simple addition to preventive care.', paragraphs: ['Professional fluoride comes in forms such as gels, foams, and varnishes. The team will explain the product recommended for you and how it is applied.', 'Treatment may be included in a preventive visit when appropriate. Follow the instructions you receive about eating, drinking, and caring for your teeth afterward, as these depend on the product used.'] },
      { id: 'prevention-plan', title: 'Look at your routine as a whole.', paragraphs: ['Discuss your toothpaste, home-care habits, and any recent cavities with the team. This helps your dentist recommend a preventive plan that fits your needs.', 'Keep attending checkups and cleanings so changes can be monitored and your recommendations adjusted over time.'] },
    ], relatedSlugs: ['oral-hygiene', 'inlays-and-onlays', 'mouth-guard-night-guard'],
  },
  {
    slug: 'mouth-guard-night-guard', name: 'Mouth Guards & Night Guards', category: 'Protect your smile',
    description: 'Custom protection for sports or teeth grinding, chosen for the way you need to use it.',
    imageAlt: 'A custom transparent dental night guard',
    introduction: 'Protection should fit both your teeth and your routine. Our St. Louis team can help you explore a sports mouth guard or night guard based on your activities, symptoms, and dental examination.',
    sections: [
      { id: 'sports-protection', title: 'Protection for active days.', paragraphs: ['A sports mouth guard helps cushion teeth against impacts during sports and recreational activities. Fit matters for comfort and for keeping the guard in place while you are active.', 'Tell your dentist which sports you play and whether you have braces or existing restorations. The team can discuss a suitable appliance and how to look after it.'] },
      { id: 'nighttime-grinding', title: 'A plan for grinding and clenching.', paragraphs: ['A night guard may be recommended to protect teeth from the effects of grinding or clenching. Your dentist will check your teeth, bite, and symptoms before advising on an appliance.', 'A night guard is different from a sports mouth guard. Jaw pain should be assessed rather than assuming a guard will resolve it, and persistent symptoms may need further evaluation.'] },
      { id: 'fitting-and-care', title: 'The right appliance for the right purpose.', paragraphs: ['Ask how to wear, clean, and store your guard, and bring it to checkups so its fit and condition can be reviewed.', 'A standard night guard is not a treatment for sleep apnea. If you have concerns about snoring or breathing during sleep, discuss assessment and purpose-designed treatment with a qualified clinician.'] },
    ], relatedSlugs: ['oral-hygiene', 'crowns', 'botox'],
  },
  {
    slug: 'emergency', name: 'Emergency Dentistry', category: 'Care when you need it',
    description: 'Contact the team about tooth pain, a damaged tooth, or another urgent dental concern.',
    imageAlt: 'A model tooth with a medical cross representing emergency dental care',
    introduction: 'Tooth pain or an injury can be unsettling. Call Alrata Art of Dentistry in St. Louis to describe what has happened and ask about the next available assessment.',
    sections: [
      { id: 'when-to-call', title: 'Tell us what has changed.', paragraphs: ['Contact the practice for concerns such as tooth pain, a chipped or cracked tooth, dental trauma, or a damaged restoration. Describe your symptoms, when they began, and any injury so the team can advise on the next step.', 'Call promptly about a knocked-out tooth or significant pain. Appointment availability must be confirmed with the practice; the website does not reserve or guarantee an emergency appointment.'] },
      { id: 'assessment', title: 'Find the cause. Understand your options.', paragraphs: ['Your dentist will examine the affected area and take imaging if needed. The aim is to identify the source of the problem and explain the care required.', 'Depending on the findings, treatment may involve repairing a tooth or restoration, root canal care, or extraction. The team will discuss the recommendation and any follow-up care rather than assuming the same treatment suits every emergency.'] },
      { id: 'urgent-medical-help', title: 'When to seek emergency medical help.', paragraphs: ['If you have difficulty breathing or swallowing, uncontrolled bleeding, or a serious facial injury, call 911 or seek emergency medical care immediately. Do not wait for an online booking or a return call from the practice.', 'For a dental problem without those symptoms, call the clinic for guidance and an assessment. Let the team know if symptoms change or worsen.'] },
    ], relatedSlugs: ['root-canal-endodontics', 'oral-surgery-extraction', 'crowns'],
    reference: { label: 'Read dental emergency guidance from the American Dental Association', href: 'https://www.mouthhealthy.org/all-topics-a-z/dental-emergencies' },
  },
]
