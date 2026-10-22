class CreateMembers < ActiveRecord::Migration[8.1]
  def change
    create_table :members do |t|
      t.string :name
      t.string :email
      t.string :department
      t.integer :year
      t.string :role
      t.string :status
      t.string :password_digest

      t.timestamps
    end
  end
end
