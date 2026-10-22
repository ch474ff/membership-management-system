class CreateMemberships < ActiveRecord::Migration[8.1]
  def change
    create_table :memberships do |t|
      t.references :member, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true
      t.string :designation

      t.timestamps
    end
  end
end
