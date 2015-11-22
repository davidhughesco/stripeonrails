class TransactionsController < ApplicationController
	before_action :set_transaction, only: [:show, :destroy]

	def index
		@transactions = Transaction.all
	end

	def show
	end

	def new
		@transaction = Transaction.new
		@transaction.amount = 10.00
	end

	def create
		@transaction = Transaction.new(transaction_params)
		if @transaction.save_with_stripe
			redirect_to @transaction, notice: 'Transaction was successful.'
		else
			render :new
		end
	end

	def destroy
		@transaction.destroy
		redirect_to transactions_url, notice: 'Transaction was successfully destroyed.'
	end

	private

	def set_transaction
		@transaction = Transaction.find(params[:id])
	end

	def transaction_params
		params.require(:transaction).permit(:stripe_token, :status, :email, :amount)
	end

end
