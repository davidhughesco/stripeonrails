class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.string :status
      t.string :email
      t.integer :amount
      t.string :stripe_token

      t.timestamps
    end
  end
end
