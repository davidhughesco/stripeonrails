class Transaction < ActiveRecord::Base

	validates_presence_of :email, message: "needs to be provided."
	validates_presence_of :amount

	def save_with_stripe
	    
	    if valid?
			customer = Stripe::Customer.create(
				source: self.stripe_token,
				email: self.email,
				description: 'Stripe on Rails Example'
			)
			Stripe::Charge.create(
				amount: self.amount * 100,
				currency: "gbp",
				customer: customer.id,
				receipt_email: self.email
			)
			self.stripe_token = customer.id
			self.status = 'Paid'
			save!
		end

		rescue 	Stripe::CardError => e
					logger.error "Stripe Error: #{e.message}"
					errors.add :base, "There was a problem with your card. Please try again."
					self.stripe_token = nil
		rescue 	Stripe::RateLimitError, Stripe::InvalidRequestError, Stripe::AuthenticationError, Stripe::APIConnectionError, Stripe::StripeError => e
					logger.error "Stripe Error: #{e.message}"
					errors.add :base, "There was an error connecting to our payment system. Please try again. Your card has not been charged."
					self.stripe_token = nil
		rescue	=> e
					logger.error "Error unrelated to Stripe"
					errors.add :base, "There was an error when submitting your details. Please try again. Your card has not been charged."
					self.stripe_token = nil	
		false

    end

end
