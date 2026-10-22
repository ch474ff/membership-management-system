class Api::V1::AuthController < ActionController::API
  def register
    member = Member.new(registration_params)
    member.role = "member"
    member.status = "active"

    if member.save
      session[:member_id] = member.id
      render json: public_member(member), status: :created
    else
      render json: { errors: member.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def login
    member = Member.find_by(email: params[:email]&.downcase)

    if member&.authenticate(params[:password])
      session[:member_id] = member.id
      render json: public_member(member)
    else
      render json: { error: "Invalid email or password" },
             status: :unauthorized
    end
  end

  def logout
    reset_session
    head :no_content
  end

  def me
    member = Member.find_by(id: session[:member_id])

    if member
      render json: public_member(member)
    else
      render json: { error: "Please log in" },
             status: :unauthorized
    end
  end

  private

  def registration_params
    params.require(:member).permit(
      :name, :email, :password, :department, :year
    ).tap do |attributes|
      attributes[:email] = attributes[:email]&.strip&.downcase
    end
  end

  def public_member(member)
    member.as_json(except: [:password_digest])
  end
end
